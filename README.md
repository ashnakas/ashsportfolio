# Ashna Kasireddy — immersive portfolio

A portfolio adaptation of the Sprint 2026 walk-up. It keeps the original blue environment, camera path, pacing, and scroll mapping while replacing the shoe meshes with a chrome cursor and adding Ashna's project artifacts in the sky.

## Experience

A beveled chrome cursor follows the original walk cadence. Four supplied project objects—Pinwheels, ReCart, SHOWAbility, and CNN Academy—float above the scene in a separate transparent layer so the underlying camera animation remains unchanged. The journey resolves into Ashna's positioning and selected-work grid.

The existing Pinwheels and ReCart case studies were copied from the supplied portfolio. SHOWAbility and CNN Academy are labeled as forthcoming. Project illustrations were reused from the supplied files. Scene interface textures interpret existing project concepts; they are not captured production screens.

## Source

- `app/sprint.html`: reference walk-up, portfolio overlay, and portfolio-specific ending copy
- `public/portfolio-after.css`: responsive selected-work styling
- `public/portfolio-after.js`: selected-work markup appended after the intro
- `public/vendor/three.module.js`: local Three.js 0.160.0 runtime (MIT)
- `app/pinwheels` and `app/recart`: existing case studies

Use `npm run dev` for the preview and `npm run build` for deployment.
