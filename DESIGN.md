# Habitual Design System

## Color Strategy

**Full palette** with intentional restraint.
Three named roles, each used deliberately for product data visualization and state communication.

### Primary: Warm Indigo
- Role: Brand identity, interactive elements, navigation
- Light: #6366F1
- Dark: #818CF8
- OKLCH basis: ~60% lightness, 0.18 chroma, 270 hue

### Success: Sage Emerald
- Role: Completion, positive state, streaks
- Light: #10B981
- Dark: #34D399
- OKLCH basis: ~65% lightness, 0.14 chroma, 155 hue

### Accent: Soft Amber
- Role: Pending state, warnings, highlights
- Light: #F59E0B
- Dark: #FBBF24
- OKLCH basis: ~70% lightness, 0.16 chroma, 80 hue

### Neutrals
- Never pure black or white. Tint every neutral toward the indigo hue (chroma 0.005-0.01).
- Background light: #FAFAFF (tinted white)
- Background dark: #0B0F1A (tinted near-black)
- Surface light: #FFFFFF
- Surface dark: #111827
- Text primary light: #0F172A
- Text primary dark: #F8FAFC
- Text secondary light: #64748B
- Text secondary dark: #94A3B8
- Border light: rgba(148,163,184,0.20)
- Border dark: rgba(148,163,184,0.14)

## Theme

**Light default, dark supported.**

Physical scene: "Someone opens Habitual on their laptop at 7am with coffee, or on their phone at 10pm before bed, wanting a calm moment of reflection and a satisfying check-off ritual."

Morning use suggests light as default. Evening use requires a thoughtful dark mode that preserves calm (not neon-on-black).

## Typography

- Font family: Inter (variable)
- Body line length: capped at 65ch
- Hierarchy through scale + weight contrast (minimum 1.25 ratio between steps)

### Scale
- Display: 3rem / 800 weight / -0.04em tracking
- H1: 2.25rem / 700 weight / -0.03em tracking
- H2: 1.5rem / 600 weight / -0.02em tracking
- Body: 1rem / 400 weight / 0 tracking
- Caption: 0.875rem / 500 weight / 0.01em tracking
- Micro: 0.75rem / 600 weight / 0.06em tracking (uppercase labels)

## Layout

- Vary spacing for rhythm. Do not use identical padding everywhere.
- Cards are the lazy answer. Use them only when the affordance genuinely requires containment.
- Do not wrap everything in a container. Most elements do not need one.
- Dashboard uses a two-column layout on large screens (habits left, analytics right).
- Maximum content width: 1400px.

## Motion

- Do not animate CSS layout properties.
- Ease out with exponential curves: cubic-bezier(0.25, 1, 0.5, 1) for most transitions.
- Habit completion: 300ms scale + opacity ease-out on the check indicator.
- No bounce, no elastic.

## Elevation

- Subtle shadows only: 0 1px 3px rgba(0,0,0,0.08) for light mode
- Dark mode shadows are much softer: 0 1px 3px rgba(0,0,0,0.25)
- No heavy drop shadows on cards.

## Component Principles

### Habit Items
- Present as list rows, not cards.
- Explicit checkbox/checkmark affordance for completion. Never make the entire row implicitly clickable for toggle.
- Completed state: subtle background tint + checkmark, not a full card color change.

### Weekly Calendar
- Horizontal strip of 7 days.
- Selected day has a ring, not a background fill.
- Today indicator is a dot, not a badge.

### Stats
- No hero-metric template (big number + small label + gradient).
- Use progress rings or contextual inline indicators instead.

### Empty States
- Illustrative, encouraging copy.
- No restated headings.

## Absolute Bans

- Side-stripe borders as accent
- Gradient text
- Glassmorphism as default
- Hero-metric template
- Identical card grids
- Modal as first thought (exhaust inline alternatives)
- Em dashes in copy
