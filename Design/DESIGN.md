---
name: Heritage & Light
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  vertical-line-width: 1px
---

## Brand & Style

The design system is centered on the concept of "Digital Heirloom." It celebrates a 60-year milestone through a lens of curated minimalism, evoking the feel of a high-end physical photo gallery or a bespoke anniversary publication. The target audience includes family members and the celebrant, requiring an interface that feels both sophisticated and deeply personal.

The aesthetic blends **Minimalism** with **Editorial design**. By prioritizing heavy whitespace and a restricted color palette, the system allows photography to remain the singular focal point. The emotional response is one of warmth, nostalgia, and quiet dignity, avoiding the coldness of corporate software in favor of a soft, approachable elegance.

## Colors

The palette is strictly monochromatic to ensure that the colors within personal photographs are never in competition with the interface. 

- **Background:** Pure White (#ffffff) is used for all primary surfaces to maximize the sense of light and space.
- **Typography:** Dark Anthracite (#1a1a1a) provides high legibility and a grounded, premium feel for headings and primary content.
- **Accents/Lines:** Soft Light Gray (#e5e5e5) is reserved for structural elements—1px dividers, borders, and subtle hair-lines that organize the layout without cluttering it.
- **Secondary Text:** A mid-tone gray (#717171) is used for metadata and labels to maintain a clear visual hierarchy.

## Typography

This design system utilizes a high-contrast typographic pairing to balance emotion with utility.

- **The Serif (Playfair Display):** Used for headlines, years, and pull-quotes. It should be set with generous leading. For "Display" roles, slight negative letter-spacing is recommended to create a tightly knit, sophisticated look.
- **The Sans-Serif (Geist):** Used for body copy, captions, and navigation elements. Its geometric precision provides a modern counterpoint to the serif, ensuring the UI feels current and accessible. 
- **Hierarchy:** Use uppercase tracking (0.1em) for small labels and dates to create an archival, "museum-label" aesthetic.

## Layout & Spacing

The layout philosophy is a **Fixed, Centered Grid** for desktop and a **Fluid Grid** for mobile. It is inspired by editorial spreads.

- **Vertical Rhythm:** A strict 8px baseline grid ensures alignment.
- **Vertical Lines:** 1px lines (#e5e5e5) are used to separate chronological eras or distinct content sections, reinforcing a "timeline" feel without using heavy containers.
- **Margins:** Intentional "dead space" is encouraged. Main content containers should rarely exceed 1200px to ensure line lengths remain readable and the composition feels airy.
- **Reflow:** On mobile, margins reduce to 20px, and multi-column photo grids collapse to a single or staggered dual-column flow to maintain image impact.

## Elevation & Depth

Depth in this design system is achieved through **Subtle Ambient Shadows** and **Tonal Layering**, rather than dramatic overlays.

- **Surface Treatment:** Most elements sit flat on the white background. 
- **Shadows:** Use extremely soft, high-diffusion shadows (e.g., `box-shadow: 0 4px 20px rgba(0,0,0,0.04)`) only for "floating" elements like expanded image modals or dropdown menus.
- **Micro-depth:** A 1px border (#e5e5e5) is the primary method of defining interactive areas. When an item is hovered or active, a subtle transition to a slightly deeper shadow or a 2px stroke is preferred over a color change.

## Shapes

The shape language is controlled and refined. 

- **Corner Radius:** A standard 8px (Soft) radius is applied to buttons, cards, and input fields. This softens the minimalist grid, making the experience feel "approachable" and "warm" rather than clinical.
- **Imagery:** Photos should typically retain these 8px corners to feel like physical printed cards.
- **Icons:** Use thin-stroke (1.5px) linear icons to match the 1px vertical line language of the overall system.

## Components

- **Buttons:** Ghost-style buttons are preferred. Use a 1px border (#e5e5e5) with `label-sm` text. On hover, the background transitions to a very faint gray (#f9f9f9) or the border darkens to #1a1a1a.
- **Cards:** For photo thumbnails, use a "Polaroid-Lite" approach: the image is primary, with a small caption area below it using `body-md` or `label-sm`. No heavy borders; use the 8px roundedness and a very soft shadow.
- **Inputs:** Clean, bottom-border-only fields or subtle 1px outlined boxes. Focus states should be indicated by the border color darkening to #1a1a1a.
- **Timeline Marker:** A custom component consisting of a 1px vertical line that connects "Year" markers (Playfair Display) to specific photo clusters.
- **Chips/Tags:** Used for "Themes" (e.g., "Travel," "Family"). These should be pill-shaped with a #f5f5f5 background and #1a1a1a text, using the `label-sm` style.
- **Lists:** Clean rows separated by 1px horizontal dividers (#e5e5e5) with generous vertical padding (24px+).