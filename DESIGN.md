# iOS-Style Design System

## Tone & Direction
Delightful, minimal iOS native experience — soft pastel palette, glassmorphic cards, spring animations, respects safe areas and notch design.

## Palette

| Token | OKLCH | Hex | Purpose |
|-------|-------|-----|---------|
| Primary Pink | 0.81 0.10 20 | #FFB6D9 | CTA, highlights, primary accent |
| Secondary Sky | 0.85 0.12 220 | #B4E7FF | Secondary accent, hover states |
| Background | 0.98 0.02 15 | #FFFBF8 | Main background, page surface |
| Card | 0.97 0.015 20 | #FFFAF7 | Elevated surfaces (glassmorphic base) |
| Foreground | 0.25 0.02 250 | #3D3D48 | Primary text, dark navy |
| Muted | 0.93 0.01 0 | #EFEFEF | Secondary surfaces, disabled state |
| Border | 0.90 0.02 0 | #E5E5E5 | Subtle dividers, focus rings |
| Destructive | 0.65 0.18 25 | #E84D4D | Error, danger, delete actions |

## Typography

| Tier | Font | Weight | Size | Usage |
|------|------|--------|------|-------|
| Display | Fraunces | 700 | 32–48px | Hero headings, page titles |
| Body | DM Sans | 400–500 | 16px | Body copy, UI labels |
| Caption | DM Sans | 400 | 12–14px | Metadata, hints, footnotes |
| Mono | Geist Mono | 400–500 | 12–14px | Code, IDs, technical content |

System font fallback: `-apple-system, BlinkMacSystemFont, system-ui` for optimal iOS rendering.

## Component Patterns

| Component | Border Radius | Shadow | Border | Notes |
|-----------|---------------|--------|--------|-------|
| Card | 16px | `0 2px 8px rgba(0,0,0,0.08)` | 1px solid `rgba(255,255,255,0.2)` | Frosted glass with backdrop-filter blur 10px |
| Button (Primary) | 12px | `0 2px 8px rgba(0,0,0,0.08)` | None | Pink gradient, 48px height for touch |
| Button (Secondary) | 12px | Minimal | 1px border | Sky blue text, white background |
| Input | 12px | Inset subtle | 1px solid border | Soft background, focus ring pink |
| Modal/Popover | 20px | `0 8px 16px rgba(0,0,0,0.12)` | None | Elevated, centered, spring animation |
| Chip / Badge | 8px | None | 1px solid | Soft muted background, pink accent |

## Structural Zones

| Zone | Background | Treatment | Border | Notes |
|------|------------|-----------|--------|-------|
| Header/Nav | Card with blur | Glassmorphic, sticky | Bottom subtle | env(safe-area-inset-top) for notch |
| Hero | Subtle gradient pink→sky, 10–15% opacity | Minimal shadows | None | Full bleed, no border radius |
| Content | Background flat | Clean, minimal | None | Use cards for elevation, not borders |
| Sidebar | Card with blur | Glassmorphic, fixed | Right subtle | env(safe-area-inset-left) support |
| Footer | Muted / card | Light background | Top subtle | env(safe-area-inset-bottom) for home bar |
| Bottom Tab Bar | Card with blur | Glassmorphic, safe-area aware | Top subtle | 56px height, rounded top 20px |

## Motion & Interaction

| Element | Easing | Duration | Distance |
|---------|--------|----------|----------|
| Entrance (fade-in-up) | cubic-bezier(0.34, 1.56, 0.64, 1) | 500ms | 12px |
| Scale (spring) | cubic-bezier(0.34, 1.56, 0.64, 1) | 400ms | scale 0.98→1 |
| Hover (lift) | cubic-bezier(0.34, 1.56, 0.64, 1) | 250ms | 3px upward |
| Drag / Gesture | cubic-bezier(0.34, 1.56, 0.64, 1) | Variable | Momentum-based |
| Glow pulse | ease-in-out | 2000ms | Pink/Sky opacity shift |

All easing tuned for iOS spring feel — subtle bounce, never harsh.

## Safe Areas & Notch Support

- Use `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, `env(safe-area-inset-right)` in padding/margin for header, footer, sidebar on notched devices.
- Bottom tab bar respects home indicator: `padding-bottom: calc(1rem + env(safe-area-inset-bottom))`.
- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`.

## Differentiation
**Frosted glass cards** with soft pink/sky gradients — every interactive surface breathes. Smooth spring animations guide user. Soft shadows replace harsh blacks — mimics iOS lighting model. No dark mode default; light, airy aesthetic throughout.

## Anti-Patterns
- ❌ Harsh shadows or glows (use subtle `rgba(0,0,0,0.08)` max).
- ❌ Rounded corners >20px (max 20px on modals, 16px standard).
- ❌ Gradient backgrounds (only 10–15% opacity overlays on subtle direction).
- ❌ Bold sans-serif fonts (DM Sans is friendly, never corporate).
- ❌ Skipped safe-area insets on mobile.

## Files Modified
- `src/frontend/src/index.css` — OKLCH tokens, glassmorphism, iOS fonts, spring animations
- `src/frontend/tailwind.config.js` — DM Sans body font, Fraunces display, soft shadows, spring easing
- `src/frontend/public/assets/fonts/` — DM Sans, Fraunces, Geist Mono bundled

---

**Target Platforms:** iOS 15+, Android 12+, modern browsers.
**Breakpoints:** Mobile-first, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
