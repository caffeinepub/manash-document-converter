# NextGen-manash-pc-World-2.0

## Current State
Admin panel at `/admin` has tabs for: dashboard, products, orders, settings, job-updates, gov-documents, contact, certificate, homepage, pan-card, govt-forms, entertainment, assam-tourism.

Missing from admin:
- Document Converter page settings
- Image Tools page settings
- AI Chat settings (API keys, persona)
- Navigation bar management
- Govt Forms 'More Info' guidelines editor
- Music 'More Songs' category pages (songs CRUD)
- Site-wide settings (logo, title, theme, payment keys)
- Footer content editor
- Assam Tourism full CRUD (already partially in admin)

## Requested Changes (Diff)

### Add
- `converter` admin tab: edit page title, description, instructions for Converter page
- `image-tools` admin tab: edit page title, tools list (name, description, icon)
- `ai-chat` admin tab: edit Groq API key, Gemini API key, chatbot persona name, welcome message
- `navigation` admin tab: manage nav links (show/hide, rename, reorder)
- `form-guidelines` admin tab: edit 'More Info' guidelines for each govt form
- `music-songs` admin tab: full CRUD for songs in all 6 Music Library categories (Bihu, Folk, Movie, Devotional, Modern, Zubeen Garg) - this feeds MusicCategoryPage
- `site-settings` admin tab: site logo URL, site title, tagline, color theme, Razorpay key, Stripe key, Shiprocket credentials
- `footer` admin tab: edit footer address, copyright text, social links

### Modify
- Tab type to include all new tabs
- Tab list rendering to show new tabs with appropriate icons
- Tab label display to handle new tab names nicely
- `settings` tab: merge or keep; site-wide settings get dedicated tab
- MusicCategoryPage: read songs from localStorage key `musicSongs_<category>` set by admin
- AssamFormsPage / FormGuidePage: read guidelines from localStorage key `formGuidelines` set by admin

### Remove
- Nothing removed

## Implementation Plan
1. Extend `Tab` type with 8 new tab values
2. Add tab buttons in the tab list with icons
3. Implement `ConverterAdminTab` component
4. Implement `ImageToolsAdminTab` component  
5. Implement `AiChatAdminTab` component
6. Implement `NavigationAdminTab` component
7. Implement `FormGuidelinesAdminTab` component (list all govt forms, edit their guideline content)
8. Implement `MusicSongsAdminTab` component (category tabs, songs CRUD with title/artist/youtubeId/category fields)
9. Implement `SiteSettingsAdminTab` component
10. Implement `FooterAdminTab` component
11. Update MusicCategoryPage to read from localStorage `musicSongs_<category>`
12. Update FormGuidePage to check localStorage `formGuidelines` for admin-edited content
13. Wire all new tab renders in AdminPage
