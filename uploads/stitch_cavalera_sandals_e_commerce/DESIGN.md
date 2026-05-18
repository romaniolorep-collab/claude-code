---
name: Cyber-Folk Industrial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c3caac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8d9479'
  outline-variant: '#434933'
  surface-tint: '#a3d800'
  primary: '#ffffff'
  on-primary: '#263500'
  primary-container: '#baf600'
  on-primary-container: '#516e00'
  inverse-primary: '#4c6700'
  secondary: '#c6c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#baf600'
  primary-fixed-dim: '#a3d800'
  on-primary-fixed: '#151f00'
  on-primary-fixed-variant: '#394e00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: anton
    fontSize: 84px
    fontWeight: '400'
    lineHeight: 90px
    letterSpacing: 0.02em
  headline-xl:
    fontFamily: anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: 0.01em
  headline-xl-mobile:
    fontFamily: anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 40px
  body-md:
    fontFamily: jetbrainsMono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: spaceMono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
  technical-code:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  container-max: 1280px
---

## Brand & Style

This design system embodies the "Cyber-Folk" aesthetic—a collision of gritty urban futurism and traditional Brazilian artisan spirit. The visual language is intentionally unpolished, theatrical, and rebellious. It draws heavily from **Brutalism** for its raw, structural integrity and **Cyberpunk** for its high-tech, neon-drenched utility.

The brand persona is a "Technological Outlaw": someone who values the precision of code but maintains the soul of hand-crafted work. The UI should feel like a digital blueprint etched onto recycled industrial materials. Expect heavy usage of textures—recycled rubber grains, metallic sheens, and distressed overlays—that provide a tactile, "eco-industrial" finish.

## Colors

The palette is anchored in a "Deep Charcoal" dark mode to evoke urban asphalt and recycled rubber. **Neon Acid Green** serves as the primary "rebellious" accent, used sparingly for critical actions and data highlights to simulate high-visibility industrial markings. 

**Metallic Silver** and **Industrial Gray** provide the structural framework, creating a cold, technical atmosphere. When layering elements, use tonal shifts in charcoal rather than shadows to maintain a flat, brutalist depth. High-contrast transitions between deep blacks and bright acid greens are essential for the "theatrical" impact of the design system.

## Typography

The typographic system pairs the aggressive, condensed impact of **Anton** for headlines with the clinical, technical precision of **JetBrains Mono** for body copy. 

- **Headlines:** Use Anton in all-caps for maximum "theatrical" presence. To achieve the "distressed" look mentioned in the brief, headlines may use subtle SVG filters or "glitch" CSS animations on hover.
- **Technical Readouts:** Use Space Mono for labels, metadata, and navigational elements. This reinforces the "high-tech" side of the Cyber-Folk narrative.
- **Hierarchy:** Maintain extreme contrast between massive display type and small, monospaced metadata.

## Layout & Spacing

The layout philosophy follows a **fixed-grid** industrial model. Interfaces are built on a rigid 12-column grid with heavy, visible gutters that act as "structural seams." 

- **Breakpoints:** Mobile (under 600px) shifts to a single-column layout with reduced margins (16px). Desktop (above 1024px) utilizes wide margins to emphasize the "brutalist" whitespace.
- **Rhythm:** Use a 4px base unit. All components should be sized in multiples of 8px to ensure they feel "bolted" into the grid. 
- **Reflow:** Content cards do not stack softly; they should snap to the grid lines with sharp, intentional borders.

## Elevation & Depth

This design system rejects soft, ambient shadows. Depth is achieved through **Bold Borders** and **Tonal Layering**:

1.  **Stacked Surfaces:** Lower surfaces use the absolute neutral hex (#0F0F0F). Raised surfaces (cards, modals) use a slightly lighter "Industrial Gray" (#2E2E2E) to create a tiered, physical effect.
2.  **Metallic Outlines:** Active or "elevated" elements are defined by 2px solid strokes in Neon Acid Green or Metallic Silver.
3.  **Graphic Overlays:** Use low-opacity (5-10%) psychedelic or religious iconography as background watermarks on containers to add "Folk" character without sacrificing legibility.
4.  **Hardware Textures:** Simulated "Recycled Rubber" textures (via grainy noise shaders) should be applied to the primary background to provide the "eco-leather" tactile finish.

## Shapes

The shape language is **Sharp (0)**. Everything in this design system is built to feel like it was cut from industrial sheet metal or heavy rubber.

- **Corners:** Strictly 0px radius for all buttons, inputs, and containers.
- **Chamfers:** For a "technical" feel, you may use 45-degree clipped corners (8px chamfer) on primary call-to-action buttons.
- **Accents:** Use heavy 4px vertical or horizontal bars to denote "active" states on the edges of components.

## Components

### Buttons
Primary buttons use a solid Neon Acid Green background with black Anton text. Hover states should trigger a "Metallic Silver" invert or a slight jitter effect. Secondary buttons are outlined in 2px silver with monospaced text.

### Cards & Containers
Cards must have a 1px solid border in a slightly lighter gray than the background. Headers should be separated by a horizontal rule to mimic industrial blueprints. Include the "double-headed eagle" logo as a small, stamped watermark in the bottom-right corner of high-level containers.

### Input Fields
Inputs are simple rectangles with no background (transparent), defined only by a bottom-border of 2px. When focused, the border glows in Neon Acid Green. Placeholder text must be monospaced and low-contrast.

### Chips & Tags
Technical metadata should be wrapped in small, rectangular chips with a "recycled rubber" grain texture and Space Mono labels.

### Hardware UI
Incorporate "heavy tread" patterns (diagonal hatch lines) as separators or loading bars to reinforce the industrial machinery metaphor.