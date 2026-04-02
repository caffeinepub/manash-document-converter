# Manash PC World 2.0

## Current State

Admin panel at `/admin` has 8 tabs:
- dashboard, products, orders, settings, job-updates, gov-documents, contact, certificate

HomePage.tsx: All content is hardcoded — hero banner URL, tribute popup, AdSense slot IDs, services, testimonials. No admin editing.

PanCardPortalPage.tsx: All content is hardcoded — SERVICES array (8 items), FAQS array (7 items), fee table (6 rows), official links (4 items), hero title/subtitle. No admin editing.

LocalStorage keys already in use: adminSession, adminConfig, contactOwnerPhoto, contactInfo, products, orders, jobs, admitCards, jobResults, govDocs.

## Requested Changes (Diff)

### Add
- Admin tab: **"Homepage"** — manage hero banner image, tribute popup toggle + photo, announcement text (show/hide + text), AdSense slot IDs (homepage + fluid), site logo, services (add/edit/delete), testimonials (add/edit/delete)
- Admin tab: **"PAN Card Portal"** — manage services list (title, desc, fee, badge — add/edit/delete), FAQ (add/edit/delete), fee table rows (add/edit/delete), official links (add/edit/delete), hero title/subtitle
- New localStorage keys: `homepageSettings`, `homepageServices`, `homepageTestimonials`, `panServices`, `panFaqs`, `panFeeTable`, `panLinks`, `panHeroText`
- HomePage.tsx reads from localStorage for hero banner, tribute toggle, AdSense slots, services, testimonials, announcement
- PanCardPortalPage.tsx reads from localStorage for SERVICES, FAQS, fee table, official links, hero title

### Modify
- AdminPage.tsx: Add 2 new tabs — "homepage" and "pan-card"
- Tab type union to include `"homepage" | "pan-card"`
- HomePage.tsx: Replace hardcoded values with localStorage-backed values (with fallback to current defaults)
- PanCardPortalPage.tsx: Replace hardcoded SERVICES, FAQS, fee table, links, hero text with localStorage-backed values (with fallback to defaults)

### Remove
- Nothing removed — all existing features preserved

## Implementation Plan

1. **AdminPage.tsx** — Add 2 new tabs to Tab type and tab bar UI
   - **Homepage tab**: Form cards for:
     - Hero Banner: image URL input + preview
     - Tribute Popup: toggle on/off, photo URL/upload
     - Announcement: enable/disable toggle + text input
     - AdSense Slots: two input fields (homepage slot, fluid slot)
     - Site Logo: URL input
     - Services: CRUD table (icon key, title, desc)
     - Testimonials: CRUD table (name, review, rating)
   - **PAN Card Portal tab**: Form cards for:
     - Hero: title + subtitle text inputs
     - Services: CRUD table (title, desc, fee, badge)
     - FAQ: CRUD table (question, answer)
     - Fee Table: CRUD table (service, indian, foreign, notes)
     - Official Links: CRUD table (title, subtitle, url)

2. **HomePage.tsx** — Replace hardcoded values:
   - Read `homepageSettings` from localStorage for: heroBannerUrl, tributeEnabled, tributePhoto, announcementText, announcementVisible, adslotHomepage, adslotFluid
   - Read `homepageServices` from localStorage for services section
   - Read `homepageTestimonials` from localStorage for testimonials section
   - Fallback to current hardcoded defaults if localStorage is empty

3. **PanCardPortalPage.tsx** — Replace hardcoded values:
   - Read `panServices` from localStorage for SERVICES array
   - Read `panFaqs` from localStorage for FAQS array
   - Read `panFeeTable` for fee table rows
   - Read `panLinks` for official links
   - Read `panHeroText` for hero title/subtitle
   - Fallback to current hardcoded defaults if localStorage is empty
