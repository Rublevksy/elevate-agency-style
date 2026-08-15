# Homepage hero rebuild

## Outcome
Rebuild only the homepage opening into a lightweight, pinned product-film sequence while preserving the rest of the site.

## Implementation
1. Replace the continuously animated ribbon canvas and separate device motion with one deterministic sticky scroll stage.
2. Use the optimized transparent MacBook WebP as the immediate first-paint visual, then transform it through CSS from the rear product view into an interface-reveal state controlled by one normalized scroll progress value.
3. Keep the opening frame minimal: exact ELEVATE brand, restrained three-line headline, small service rail, large right-aligned device, black negative space, controlled light lines, shadow, and reflection.
4. Build the screen reveal as lightweight HTML inside the device sequence, then crossfade/translate into the existing services section at the end of the pinned timeline.
5. Give mobile a shorter static/reduced-motion composition with no desktop-only continuous rendering or oversized asset download.
6. Remove or disable hero-specific perpetual animation loops and expensive blur/filter layers; retain one requestAnimationFrame-throttled passive scroll handler that writes CSS variables only while scrolling/resizing.
7. Preserve navigation, language switching, routes, services, projects, pricing, contact, analytics, and cookie consent.

## Technical details
- No Three.js/R3F, reflective WebGL floor, postprocessing, particles, GSAP, or Framer Motion in the hero.
- One sticky stage inside a scroll-height wrapper; forward/backward motion derives directly from wrapper scroll position and is symmetrical.
- Exact media dimensions, high-priority optimized WebP, semantic color tokens, visibility/reduced-motion guards, and event cleanup.
- Validate at 1536×1024 and mobile, including forward/reverse scroll, refresh, resize, reduced motion, console, network, and layout stability.
