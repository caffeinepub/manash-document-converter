# NextGen-manash-pc-World-2.0

## Current State
- Full-stack web platform with dark navy + gold theme throughout
- All pages use hardcoded OKLCH dark values in index.css and inline styles
- No theme toggle exists anywhere
- JobUpdatesPage.tsx has a premium hero section, job listings, CSC Login button in hero and sidebar
- AdminPage.tsx has many tabs: Products, Orders, Job Updates, Govt Documents, Govt Forms, Contact Us, PAN Card Portal, Homepage, Entertainment, Assam Tourism, AI Chat, Navigation, Form Guidelines, Music Songs, Site Settings, Footer
- App.tsx wraps all pages in a `<div className="min-h-screen bg-white">` (bg-white is overridden by body styles)

## Requested Changes (Diff)

### Add
1. **Global Light/Dark/Auto Theme System**
   - A `ThemeProvider` context (`src/frontend/src/hooks/useTheme.tsx`) that:
     - Stores user preference in localStorage (`theme`: `light` | `dark` | `auto`)
     - On `auto`, detects system preference via `prefers-color-scheme: dark`
     - Applies `class="dark"` or `class="light"` to `<html>` element
   - Light theme CSS variables in `index.css` under `.light` class:
     - Background: white/light grey (oklch ~0.97 0.01 250)
     - Foreground: dark navy (oklch ~0.15 0.04 250)
     - Card: oklch 0.93 0.01 250
     - Primary: gold oklch 0.65 0.18 65 (stays gold)
     - Border: oklch 0.85 0.02 250
   - Dark theme variables remain as current (under `.dark` class)
   - Default remains dark

2. **Theme Toggle Button**
   - In `Header.tsx`: Add a Sun/Moon/Auto toggle button in the right icons area (before cart icon)
   - In `HomePage.tsx` footer section: Add the same toggle
   - Toggle cycles through: Auto → Light → Dark → Auto
   - Icons: Sun (light), Moon (dark), Monitor/Sparkle (auto)
   - Shows current mode label on hover

3. **CSC Bridge Section on Job Updates Page**
   - Add a prominent CSC (Common Service Centre) bridge section at the TOP of JobUpdatesPage, before the hero/job listings
   - Design: premium card/banner with dark navy bg, gold accents
   - Content:
     - Title: "CSC – Common Service Centre"
     - Subtitle: "Digital India's Network of Over 5 Lakh+ Service Points"
     - Services grid (6 icons): PAN Card, Aadhaar, Banking, Insurance, Passport, Digital Literacy
     - Big "CSC Login" CTA button → opens `https://www.csc.gov.in` in new tab
     - "Register as CSC VLE" secondary button → opens `https://register.csc.gov.in` in new tab
   - Animated entrance (fadeInUp)

4. **CSC Section Admin Tab**
   - In `AdminPage.tsx`: Add a new "CSC Section" tab
   - Fields editable:
     - CSC section title
     - CSC section subtitle/description
     - CSC Login URL
     - Register VLE URL
     - Services list (name + icon emoji) — add/edit/delete
     - Show/hide toggle for the entire CSC bridge section
   - Settings stored in localStorage key `cscSectionSettings`

### Modify
- `index.css`: Add `.light` and `.dark` class CSS variable overrides so both themes work
- `App.tsx`: Wrap with ThemeProvider, replace `bg-white` with theme-aware class
- `Header.tsx`: Add theme toggle button
- `HomePage.tsx`: Add theme toggle in footer area
- `JobUpdatesPage.tsx`: Add CSC bridge section at top, reading from `cscSectionSettings` localStorage

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/hooks/useTheme.tsx` — ThemeProvider + useTheme hook
2. Update `src/frontend/src/index.css` — add `.light` and `.dark` CSS variable blocks
3. Update `src/frontend/src/App.tsx` — wrap with ThemeProvider, fix root div class
4. Update `src/frontend/src/components/Header.tsx` — add theme toggle button with Sun/Moon/Monitor icons
5. Update `src/frontend/src/pages/HomePage.tsx` — add theme toggle in footer area
6. Update `src/frontend/src/pages/JobUpdatesPage.tsx` — add CSC bridge section at top using localStorage settings
7. Update `src/frontend/src/pages/AdminPage.tsx` — add CSC Section tab with full CRUD for the bridge section settings
8. Validate (lint, typecheck, build)
