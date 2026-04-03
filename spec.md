# NextGen IT Hub

## Current State
The app is a comprehensive admin-driven web platform. The Contact Us page (`/contact-us`) shows owner info, social links, profile photo, authorised logos carousel, and Google Maps embed. The Admin Panel has a `contact` tab managing owner info, photo, address, contact details, and social media links.

## Requested Changes (Diff)

### Add
- **"Other Websites" section** on the Contact Us page — displayed as a responsive grid of glassmorphism cards below the existing content (above or below Maps)
- Each card shows: website logo (img from URL), website name, short description, website preview image (from URL), and an external link button opening in a new tab
- **Admin Panel > Contact Us tab** — new sub-section at the bottom: "Other Websites" CRUD panel with add/edit/delete functionality
- Admin fields per website: Name, Short Description, Website URL, Logo URL, Preview Image URL
- Data stored in localStorage key `otherWebsites` as JSON array
- Auto-fetch favicon fallback: if Logo URL is empty, use `https://www.google.com/s2/favicons?domain={url}&sz=64`

### Modify
- `ContactUsPage.tsx` — add Other Websites section with glassmorphism card grid
- `AdminPage.tsx` — extend Contact tab with Other Websites CRUD sub-section; add `other-websites` to Tab type if needed, or keep it inline inside `contact` tab

### Remove
- Nothing removed

## Implementation Plan
1. Add `otherWebsites` data helpers in types or inline with localStorage
2. In `ContactUsPage.tsx`: add a new section after the authorised logos section showing glassmorphism cards for other websites
3. In `AdminPage.tsx`: add CRUD UI at the bottom of the `contact` tab for managing other websites
4. Card design matches existing glassmorphism style (dark navy bg, gold border/accents, hover glow)
5. Cards open website URL in new tab on click
6. Preload 3 sample websites (CSC Portal, Digital India, Income Tax Portal)
