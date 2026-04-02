# Manash PC World 2.0

## Current State
Job Updates page (`/job-updates`) has hardcoded 12 job listings (JOBS array), 4 admit cards, and 4 results in the component file. Admin panel (`/admin`) manages only products, orders, and settings — no job management.

## Requested Changes (Diff)

### Add
- "Job Updates" tab in AdminPage with full CRUD for job listings
- Ability to Add / Edit / Delete jobs (title, org, category, posts, lastDate, status, type, description, applyLink)
- Ability to Add / Edit / Delete Admit Cards entries
- Ability to Add / Edit / Delete Results entries
- Jobs/Admit Cards/Results stored in localStorage so changes persist
- Helper functions in types.ts: `getJobs`, `saveJobs`, `getAdmitCards`, `saveAdmitCards`, `getResults`, `saveResults` — with default data seeded if empty

### Modify
- JobUpdatesPage: read jobs, admit cards, results from localStorage instead of hardcoded constants
- AdminPage: add `job-updates` as a new Tab type and render Job Updates management UI

### Remove
- Hardcoded JOBS, ADMIT_CARDS, RESULTS arrays from JobUpdatesPage (replaced by localStorage data)

## Implementation Plan
1. Add Job/AdmitCard/Result types and CRUD helpers to `types.ts`
2. Update `JobUpdatesPage.tsx` to read from localStorage
3. Add "Job Updates" tab to `AdminPage.tsx` with Add/Edit/Delete dialogs
