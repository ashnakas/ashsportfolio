import html from "./sprint.html?raw";

// Deliver the original document directly so its Webflow, GSAP, Three.js,
// and Rive lifecycle runs without React hydration changing the DOM.
export function GET() {
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
