# 3D world preview

Retains the original Three.js city as the homepage, with a composed scene visible on arrival. Four project destinations are accessible through the persistent first-screen dock and an HTML project list: ReCart, Pinwheels, SHOWAbility, and Moon Base.

## Implemented

- Restrained blue, white, and dark architectural palette; desktop directional shadows; mobile resolution cap.
- Immediate city visibility, without the previous multi-screen building reveal.
- Named storefronts, the original Pinwheels concept board, a rotating physical pinwheel, and a rooftop Moon Base observatory.
- Project camera transitions and native dialog panels. Closing returns to the previous camera position and keyboard focus.
- ReCart interaction study: query, maximum price, saves, saved-only view, reset, and empty state. Inventory is explicitly labeled as sample data.
- Work, Making, About, Contact, case studies, reduced-motion behavior, and an HTML fallback project list.

## Review before production

Build, TypeScript, script syntax, and DOM interaction checks passed. Browser rendering and device-level WebGL QA are not verified in this environment. Review the local package on desktop and mobile before publishing. This is a first visual pass and remains on a preview branch; the production branch is unchanged.

ReCart's billboard remains a schematic interaction graphic because verified application screenshots are not supplied. Pinwheels uses the original board; its opening panel crops the undocumented metrics section out of the visible preview. Case-study copy preserves evidence limits.
