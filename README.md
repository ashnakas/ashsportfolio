# Sprint 2026 intro

Recreation of the opening 3D experience from https://razorpay.com/sprint/26. Includes the loading screen, responsive 3D scene, mouse parallax, scroll-driven camera movement, and transition into the hero title. Product sections and external calls to action are excluded.

`app/sprint.html` contains the intro document and animation logic. `public/assets/sprint.css` holds the reference styling. Three.js, GSAP, models, fonts, and images use their original public CDNs. `app/route.ts` serves the HTML without React hydration so the 3D animation lifecycle is preserved.

Run `npm run dev` and `npm run build`.
