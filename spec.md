# NextGen Manash PC World 2.0 — Entertainment Hub

## Current State
App has multiple pages: Home, Shop, Converter, Image Tools, Job Updates, Gov Documents, Assam Forms, Contact Us, AI Chat, PAN Card Portal, Admin. Navigation is handled via a `Page` type union in App.tsx. Header component has navigation links.

## Requested Changes (Diff)

### Add
- New `/entertainment` route and `EntertainmentPage` component
- Entertainment Hub button on Homepage — animated, prominent, redirects to `/entertainment`
- "Entertainment" link in navigation bar (Header)
- EntertainmentPage with the following sections:
  1. **Mini Games** — Snake game, Tic Tac Toe, Quiz game (browser-based, no external deps)
  2. **YouTube Embeds** — Assamese/Bollywood popular songs & videos (static embed list)
  3. **Fun Facts & Jokes** — Rotating daily content (static array, changes per day)
  4. **Horoscope** — Daily rashifal for 12 zodiac signs (static content)
  5. **News Ticker** — Trending headline ticker (static headlines rotating)
  6. **Local Assam Content** — Bihu songs, cultural highlights section

### Modify
- `App.tsx` — Add `"entertainment"` to `Page` type, import `EntertainmentPage`, add route handler
- `Header.tsx` — Add "Entertainment" nav link
- `HomePage.tsx` — Add animated "Entertainment Hub" button/section that navigates to entertainment page

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/EntertainmentPage.tsx` with all 6 sections
2. Update `App.tsx` — add `"entertainment"` to Page type, import and render EntertainmentPage
3. Update `Header.tsx` — add Entertainment nav link
4. Update `HomePage.tsx` — add animated Entertainment Hub button between sections
