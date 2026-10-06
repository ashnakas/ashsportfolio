import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'vercel-dist');
const renderDirectory = join(root, 'dist/static-render');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {cwd:root, stdio:'inherit'});
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`)));
  });
}

// Validate the application with its normal build, then render its actual shared
// components to static HTML. No local Worker server or duplicated project copy.
await run('npx', ['vinext', 'build']);
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
await cp(join(root, 'public'), output, {recursive:true});
await writeFile(join(output, 'index.html'), await readFile(join(root, 'app/sprint.html'), 'utf8'));
await cp(join(root, 'app/case-study.css'), join(output, 'case-study.css'));
await cp(join(root, 'app/globals.css'), join(output, 'case-global.css'));
await mkdir(renderDirectory, {recursive:true});

async function loadStaticComponent(sourcePath, name) {
  const source = (await readFile(join(root, sourcePath), 'utf8')).replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '');
  const {outputText} = ts.transpileModule(source, {
    compilerOptions:{jsx:ts.JsxEmit.ReactJSX, target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.ESNext}
  });
  const modulePath = join(renderDirectory, `${name}.mjs`);
  await writeFile(modulePath, outputText);
  return import(pathToFileURL(modulePath).href);
}
const {default:CaseStudy, projects} = await loadStaticComponent('app/case-study-template.tsx', 'case-study');
const {default:Journal, metadata:journalMetadata} = await loadStaticComponent('app/making/moon-base/page.tsx', 'journal');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
async function exportPage(route, title, description, component) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/case-global.css"><link rel="stylesheet" href="/case-study.css"></head><body>${renderToStaticMarkup(component)}</body></html>`;
  const directory = join(output, route);
  await mkdir(directory, {recursive:true});
  await writeFile(join(directory, 'index.html'), html);
}
for (const [key, project] of Object.entries(projects)) {
  const route = ['recart', 'pinwheels'].includes(key) ? key : `projects/${key}`;
  await exportPage(route, `${project.title} — Ashna Kasireddy`, project.summary, createElement(CaseStudy, {project}));
}
await exportPage('making/moon-base', journalMetadata.title, journalMetadata.description, createElement(Journal));
console.log(`Vercel static output ready: homepage, city, ${Object.keys(projects).length} case studies, and making journal.`);
