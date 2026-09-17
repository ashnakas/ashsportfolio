import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'vercel-dist');
const port = 8971;

// The case-study pages are real React Server Component routes (app/recart, app/pinwheels,
// app/projects/[slug]) — they carry the actual case-study content, not a duplicate. Rather than
// hand-copying that copy into a second static template (which drifts out of sync), we build the
// app for real, boot it once, and crawl the rendered HTML straight into the static export.
const caseStudyRoutes = [
  'recart',
  'pinwheels',
  'projects/showability',
  'projects/seatscore',
  'projects/opslens',
  'projects/cnn',
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {cwd: root, stdio: 'inherit'});
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))));
  });
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server never became ready at ${url}`);
}

await run('npx', ['vinext', 'build']);

await rm(output, {recursive: true, force: true});
await mkdir(output, {recursive: true});
await cp(join(root, 'public'), output, {recursive: true});
await cp(join(root, 'dist/client/_next'), join(output, '_next'), {recursive: true});
await writeFile(join(output, 'index.html'), await readFile(join(root, 'app/sprint.html'), 'utf8'));

const server = spawn('npx', ['wrangler', 'dev', '--config', 'dist/server/wrangler.json', '--port', String(port)], {
  cwd: root,
  stdio: ['ignore', 'ignore', 'pipe'],
});
let serverError = '';
server.stderr.on('data', (chunk) => {
  serverError += chunk;
});

try {
  await waitForServer(`http://localhost:${port}/${caseStudyRoutes[0]}`);
  for (const route of caseStudyRoutes) {
    const res = await fetch(`http://localhost:${port}/${route}`);
    if (!res.ok) throw new Error(`Failed to render /${route}: HTTP ${res.status}`);
    let html = await res.text();
    // next/image's on-demand resize endpoint needs a live server; point straight at the
    // already-copied source file instead so the static export needs no backend.
    html = html.replace(/\/_next\/image\?url=([^&"']+)(?:&amp;[^"']*|&[^"']*)?/g, (_match, encoded) => decodeURIComponent(encoded));
    // These pages are static content with no interactivity except one scroll-spy nav, so the
    // client bundle isn't worth shipping — and vinext's Link component assumes a live RSC
    // server for transitions, which throws and swallows the click on a script-free static host.
    // Stripping the hydration scripts leaves every link a plain, always-working <a> tag.
    html = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<script\b[^>]*\/>/g, '')
      .replace(/<link rel="modulepreload"[^>]*>/g, '');
    const dir = join(output, route);
    await mkdir(dir, {recursive: true});
    await writeFile(join(dir, 'index.html'), html);
  }
} catch (error) {
  console.error(serverError);
  throw error;
} finally {
  server.kill();
}

console.log(`Vercel static output ready at ${output}`);
