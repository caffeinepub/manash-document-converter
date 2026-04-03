# NextGen-manash-pc-World-2.0

## Current State
The app has: Homepage, Shop, Converter, Image Tools, Job Updates, Gov Documents, Assam Forms, Contact Us, AI Chat, PAN Card Portal, Entertainment Hub, Admin Panel. No Assam tourism feature exists.

## Requested Changes (Diff)

### Add
- New `/assam-tourism` page: "Incredible Assam" photo gallery + detailed info for 10 famous places
- Homepage preview section: "Incredible Assam" teaser with "Explore More" button linking to full page
- Admin Panel "Assam Tourism" tab: CRUD for places (name, tagline, description, best time, how to reach, local food, cultural info, image)
- Navigation header link: "Assam Tourism"
- New Page type: `"assam-tourism"`
- New page file: `AssamTourismPage.tsx`

### Modify
- `App.tsx`: Add `"assam-tourism"` to Page type union, add route render, import AssamTourismPage
- `Header.tsx`: Add "Assam Tourism" nav link
- `HomePage.tsx`: Add Incredible Assam preview section (3 cards + CTA button)
- `AdminPage.tsx`: Add "assam-tourism" Tab type, tab button, tab content for CRUD

### Remove
- Nothing

## Implementation Plan
1. Create `AssamTourismPage.tsx` with:
   - Hero section: "Incredible Assam" with animated title
   - Photo gallery grid (3-col desktop, 2-col tablet, 1-col mobile)
   - Each card: photo, place name, tagline, description, expandable detail (best time, how to reach, local food, cultural info)
   - Reads custom places from localStorage (admin-added) + merges with built-in 10 places
   - Full-page modal/expand on click
2. Update `App.tsx`: Add `"assam-tourism"` page type and route
3. Update `Header.tsx`: Add "Assam Tourism" nav item
4. Update `HomePage.tsx`: Add Incredible Assam section between Entertainment Hub and Services
5. Update `AdminPage.tsx`: Add `"assam-tourism"` tab with CRUD

Built-in 10 places with generated images:
1. Kaziranga National Park - `/assets/generated/kaziranga.dim_800x500.jpg`
2. Majuli Island - `/assets/generated/majuli.dim_800x500.jpg`
3. Kamakhya Temple - `/assets/generated/kamakhya.dim_800x500.jpg`
4. Brahmaputra River - `/assets/generated/brahmaputra.dim_800x500.jpg`
5. Sivasagar - `/assets/generated/sivasagar.dim_800x500.jpg`
6. Manas National Park - `/assets/generated/manas.dim_800x500.jpg`
7. Haflong - `/assets/generated/haflong.dim_800x500.jpg`
8. Tezpur - `/assets/generated/tezpur.dim_800x500.jpg`
9. Jorhat Tea Gardens - `/assets/generated/jorhat-tea.dim_800x500.jpg`
10. Bihu Festival - `/assets/generated/bihu-festival.dim_800x500.jpg`
