import html from './sprint.html?raw';

// Serve the immersive entry as a standalone document. Case studies use React routes.
export function GET() {
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
