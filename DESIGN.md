---
name: Operational Integrity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin: 32px
  container-max: 1440px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built on the principle of **Operational Integrity**. It blends the polished, networking-focused professionalism of high-end corporate SaaS with the high-stakes, data-driven utility of a humanitarian command center. The aesthetic is "LinkedIn meets humanitarian operations dashboard"—prioritizing clarity, speed of cognition, and institutional trust.

The chosen style is **Corporate / Modern** with a lean toward **Minimalism**. It utilizes heavy white space to reduce cognitive load during emergency missions, ensuring that critical data points are never obscured by decorative elements. The interface avoids "playful" NGO tropes in favor of a serious, institutional character that reassures stakeholders and field operatives alike.

## Colors

The color palette is anchored by **Primary Teal (#0D9488)**, representing a modern, mission-driven stability. It is supported by **Deep Blue (#0F172A)**, used for primary navigation and heavy typography to ground the interface in institutional authority.

- **Action & Primary:** Teal is used for primary calls to action and active states.
- **Success & Growth:** Sage Green is reserved for positive outcomes, completed logistics, and "Safe" statuses.
- **Urgency & Alerts:** The Orange/Red (#F43F5E) is a high-visibility utility color used exclusively for "Emergency Missions," critical resource shortages, or life-safety alerts.
- **Backgrounds:** Use a very light grey-blue tint (#F8FAFC) for page backgrounds to provide subtle contrast against white component cards.

## Typography

This system uses a dual-font strategy to balance modern SaaS aesthetics with institutional readability.

1. **Headings (Inter):** Chosen for its geometric precision and professional weight. Headlines should be bold and tight to convey authority.
2. **Body & UI (Public Sans):** Chosen for its origins in government and institutional design. It provides exceptional legibility for long-form reports and dense data tables.

**Special Note:** For logistical coordinates, tracking numbers, and financial data, use Inter with tabular lining (tnum) enabled to ensure vertical alignment in columns.

## Layout & Spacing

The system utilizes a **12-column fixed-width grid** for desktop environments, centered with a maximum width of 1440px. This ensures that operational dashboards remain readable on ultra-wide monitors used in coordination centers.

- **Grid:** Use a 24px gutter to maintain a clean separation of data modules.
- **Padding:** Apply generous internal padding (min 24px) to cards and containers to avoid a "cluttered" feel.
- **Rhythm:** All vertical spacing must follow a 4px baseline grid (4, 8, 12, 16, 24, 32, 48, 64). Use 16px as the default spacing between related UI elements.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with **Low-Contrast Outlines** to define hierarchy.

- **Base Layer:** The background is a soft neutral (#F8FAFC).
- **Surface Layer:** White cards (#FFFFFF) house all primary content.
- **Borders:** Use subtle 1px borders (#E2E8F0) on all interactive components (inputs, cards, buttons).
- **Shadows:** Use "Professional Shadows"—highly diffused, low-opacity (4-8%) neutral-grey blurs. Avoid heavy black shadows. Shadows should only appear on elevated elements like dropdowns, modals, or "active" cards to indicate they are floating above the main surface.

## Shapes

The shape language is **Soft and Precise**. 

A consistent 0.25rem (4px) corner radius is applied to standard components like buttons and input fields, reflecting a rigorous, systematic personality. Larger containers, such as dashboard cards or modals, may use up to 0.5rem (8px) to soften the overall interface without losing its professional edge. Circular shapes are strictly reserved for user avatars and notification pips.

## Components

- **Buttons:** Primary buttons use the Teal background with white text. Ghost buttons use Deep Blue text with no background. Every button has a subtle 1px border that is 10% darker than its fill.
- **Data Cards:** Essential for dashboards. Must include a header row with a 1px bottom border, a title in Inter Bold, and an optional "Action" link (e.g., "View Details").
- **Inputs:** High-contrast text on white backgrounds. Active states use a 2px Teal ring (offset by 2px) to meet accessibility standards.
- **Status Chips:** Use a "Light Fill" style—e.g., a Sage Green chip has a 10% opacity Sage background with 100% opacity Sage text. This prevents the UI from becoming visually overwhelming.
- **Emergency Indicators:** A specialized component (e.g., a "Mission Banner") that uses the Urgent Orange/Red as a solid top-border and icon color to immediately draw the eye during crises.
- **Navigation:** A persistent sidebar using Deep Blue (#0F172A) with white or light-grey icons to provide a high-contrast anchor for the user.