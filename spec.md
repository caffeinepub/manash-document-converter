# Manash PC World 2.0

## Current State
- Contact Us page (`/contact`) shows owner info (Mr. Manashjoyti Barman), social links, "We Are Authorised" logo carousel, and a placeholder/no Google Maps embed
- Admin panel (`/admin`) has tabs for Products, Orders, Settings, Job Updates, Govt Documents, and Contact Us (owner name, address, phone, email, social links)
- No owner profile photo upload or display on Contact Us page
- No Google Maps embed on Contact Us page

## Requested Changes (Diff)

### Add
- Owner profile photo upload in Admin > Contact Us tab (file input, stores as base64 in localStorage)
- Owner profile photo display on Contact Us page (circular avatar above owner name)
- Google Maps embed for Chamata, Nalbari, Assam on Contact Us page (below social links, above or below the "We Are Authorised" section)

### Modify
- Admin Contact Us tab: add photo upload field with preview
- Contact Us page: render owner photo from localStorage if set, else show placeholder avatar; add Google Maps iframe embed

### Remove
- Nothing removed

## Implementation Plan
1. In AdminPage.tsx Contact Us tab: add an image file input, read as base64, store in localStorage key `contactOwnerPhoto`, show preview
2. In ContactUsPage.tsx: read `contactOwnerPhoto` from localStorage, display as circular avatar above owner name
3. In ContactUsPage.tsx: add Google Maps iframe embed for Chamata, Nalbari, Assam (standard embed URL)
