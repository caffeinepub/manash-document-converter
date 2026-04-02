# Manash PC World 2.0

## Current State
App has a `/gov-documents` page with document guides. No standalone forms library exists. Admin panel has tabs for dashboard, products, orders, settings, job-updates, gov-documents, contact, certificate, homepage, pan-card.

## Requested Changes (Diff)

### Add
- New `/assam-forms` page: Government Forms Library with all Assam edistrict forms + PAN, Aadhaar, and other central government forms. Each form has: title, category, description, download URL (official PDF link). Features: search, category filter, download button.
- "Government Documents" button at the top of GovDocumentsPage that navigates to `/assam-forms`
- New "Govt Forms" tab in AdminPage for full CRUD of forms library (add/edit/delete, set category, PDF URL)
- `assam-forms` added to Page type and App.tsx routing
- localStorage key `govFormsLibrary` for storing admin-managed forms

### Modify
- GovDocumentsPage: add a prominent button at the top hero section linking to `/assam-forms`
- AdminPage: add `govt-forms` to Tab type, add tab button, add tab content section with GovFormsAdminTab component
- App.tsx: add `assam-forms` to Page type, import AssamFormsPage, add render condition

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/AssamFormsPage.tsx` with full forms library (50+ pre-loaded forms across categories: PAN Card, Aadhaar, Assam edistrict, Passport, Voter ID, Driving Licence, Income Tax, Birth/Death Certificate, Land Records)
2. Add `navigate` prop support or use window-based navigation via a shared navigate pattern
3. Modify `GovDocumentsPage.tsx` to add a "Government Document Forms" button in the hero/top section
4. Modify `AdminPage.tsx` to add `govt-forms` Tab, tab button, and GovFormsAdminTab component with CRUD
5. Modify `App.tsx` to add `assam-forms` to Page type, import new page, render it
