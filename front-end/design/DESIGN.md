# Design System Specification: The Cinematic Curator

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Stage"**
This design system is not merely a dark mode interface; it is a digital theater where content is the protagonist. Moving beyond the "standard" boxy layouts of common video platforms, we utilize a "Obsidian Stage" philosophy. This means the UI exists in a state of high-contrast elegance—where deep, ink-like blacks provide the foundation for vibrant, cinematic accents.

We break the "template" look by favoring **intentional asymmetry** and **tonal depth**. Instead of rigid grids, we use breathing room and overlapping glass layers to create an editorial feel that suggests high-end production value. The goal is a professional, high-contrast environment that feels both authoritative and immersive.

---

## 2. Colors
Our palette is anchored in the intensity of `#0F0F0F` (Deep Black) and the energy of `#FF0000` (YouTube Red). However, a premium system is built in the nuances between these extremes.

### Surface Hierarchy & Nesting
To achieve a signature look, we prohibit the use of flat layouts. We treat the UI as physical layers of "Obsidian Glass."
*   **Base Layer:** `surface` (#131313) – The infinite void.
*   **Secondary Sections:** `surface_container_low` (#1C1B1B) – Used for secondary sidebars or global navigation.
*   **Primary Content Containers:** `surface_container_high` (#2A2A2A) – Used for main video cards or active modules.
*   **Active/Elevated Elements:** `surface_bright` (#3A3939) – Reserved for "pop-out" utility menus.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background shifts. For example, a `surface_container_low` sidebar should sit directly against a `surface` main stage. The human eye will perceive the change in luminance as a boundary, creating a cleaner, more expensive aesthetic.

### The "Glass & Gradient" Rule
To inject "soul" into the interface:
*   **Glassmorphism:** For floating headers or overlays, use `surface_container` at 70% opacity with a `24px` backdrop-blur.
*   **Signature Gradients:** Main CTAs should never be flat. Use a subtle linear gradient from `primary` (#FFB4A8) to `primary_container` (#FF5540) at a 135-degree angle to create a sense of light-source directionality.

---

## 3. Typography
We utilize a clean, highly legible scale that prioritizes information density without sacrificing elegance. We lead with **Inter** for its modern, neutral geometric qualities that pair perfectly with high-contrast dark themes.

*   **Display (lg/md/sm):** Used for "Hero" content or channel branding. Set these with `-0.02em` letter spacing to feel "tight" and editorial.
*   **Headline (lg/md/sm):** Our primary storytelling tool. Use `headline-lg` (2rem) for page titles to command immediate attention.
*   **Body (lg/md/sm):** Optimized for readability against dark backgrounds. Always use `on_surface` (#E5E2E1) for body text to avoid the "vibrating" effect of pure white-on-black.
*   **Labels:** Reserved for metadata (durations, view counts). Use `label-md` with `on_surface_variant` (#EBBBB4) to create a clear secondary hierarchy.

---

## 4. Elevation & Depth
In this system, elevation is a product of light and transparency, not structural lines.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface_container_lowest` card on a `surface_container_low` section to create a "recessed" look, or a `surface_container_highest` card on `surface` to create a "raised" look.
*   **Ambient Shadows:** For floating modals, use a "Deep Glow." Instead of black shadows, use a 60px blur shadow using `surface_container_lowest` at 40% opacity. This mimics the way light disappears in a dark room.
*   **The "Ghost Border" Fallback:** If a container requires further definition (e.g., a thumbnail on a similarly colored background), use a `0.5px` border of `outline_variant` (#603E39) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** High-impact. Background: `primary_container`. Text: `on_primary_container`. No border. Subtle rounding: `md` (0.375rem).
*   **Secondary:** The "Glass" Button. Background: `surface_variant` at 40% opacity with backdrop blur. Text: `on_surface`.
*   **Tertiary:** Text only. Use `primary` color for the label to indicate interactivity.

### Cards & Lists
*   **The Content Card:** Strictly forbid divider lines. Separate cards using `16px` or `24px` of vertical whitespace. 
*   **The Thumbnail:** Use a `xl` (0.75rem) corner radius for video thumbnails to soften the "sharp" lines of the typography, creating a sophisticated contrast.

### Input Fields
*   **State:** Default state should be `surface_container_highest`.
*   **Interaction:** On focus, do not use a heavy border. Transition the background to `surface_bright` and add a `2px` bottom-accent line in `primary`.

### Navigation Rails
*   Use `surface_container_low` for the background. Icons should use `on_surface_variant`. When active, the icon transitions to `primary` with a subtle glow (soft shadow in the primary color).

---

## 6. Do's and Don'ts

### Do:
*   **Do** use "Optical Alignment." Because we lack borders, ensure elements are perfectly aligned to the grid to maintain professional rigor.
*   **Do** use `tertiary_container` (#488FFF) for information-dense tooltips or "New" badges to provide a cooling contrast to the YouTube Red.
*   **Do** embrace negative space. If a layout feels crowded, increase the spacing rather than adding a divider line.

### Don't:
*   **Don't** use pure `#FFFFFF` for text. It causes eye strain in dark themes. Stick to the `on_surface` (#E5E2E1) token.
*   **Don't** use "Drop Shadows" on cards. Use tonal shifts in the `surface_container` scale instead.
*   **Don't** use the `primary` red for large background areas. It is a "laser pointer"—use it to direct the eye, not to paint the room. Red should occupy no more than 5-10% of the screen real estate.