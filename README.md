# Ashna Kasireddy — immersive portfolio

A custom Three.js portfolio inspired by Sprint’s saturated blue world, metallic materials, scale, and scroll-driven camera. No Razorpay model, marks, animation code, or payment interfaces are used.

## Experience

A beveled chrome cursor travels past a Pinwheels discovery phone, a wire ReCart shopping cart, a SHOWAbility accessibility panel, and a CNN Academy broadcast camera. Scroll position drives camera travel, discovery states, listing convergence, contrast changes, and broadcast timing. The journey resolves at Ashna’s name billboard and a selected-work grid.

The existing Pinwheels and ReCart case studies were copied from the supplied portfolio. SHOWAbility and CNN Academy are labeled as forthcoming. Project illustrations were reused from the supplied files. Scene interface textures interpret existing project concepts; they are not captured production screens.

## Source

- `app/sprint.html`: entry document and semantic portfolio content
- `public/portfolio.js`: custom 3D scene, camera keyframes, texture states, and lifecycle
- `public/portfolio.css`: responsive entry styling
- `public/vendor/three.module.js`: local Three.js 0.160.0 runtime (MIT)
- `app/pinwheels` and `app/recart`: existing case studies

Use `npm run dev` for the preview and `npm run build` for deployment. Rendering pauses when the scene is offscreen or the tab is hidden. Reduced-motion preference and the motion control provide a single-frame intro. Work stays accessible without JavaScript or WebGL.
