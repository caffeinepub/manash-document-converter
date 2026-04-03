# NextGen-manash-pc-World-2.0

## Current State
- AdminPage.tsx has `ADMIN_PASSWORD = "Admin@123"` hardcoded at line 106
- Admin panel is accessible at `/admin` route (navigate('admin'))
- Navigation is managed by Header component
- Admin tabs include: dashboard, products, orders, settings, job-updates, gov-documents, contact, certificate, homepage, pan-card, govt-forms, entertainment, assam-tourism, converter, image-tools, ai-chat, navigation, form-guidelines, music-songs, site-settings, footer, csc-section
- No Admin Panel link in the navigation bar currently
- No proper Dashboard tab with stats (exists as tab type but needs real stats UI)
- No Monthly Report tab

## Requested Changes (Diff)

### Add
- Navigation bar: "Admin Panel" link visible to all users, navigates to `/admin`
- Admin panel Dashboard tab: show stats cards (total orders, total revenue, products count, active jobs, recent orders table, monthly activity summary)
- Admin panel Monthly Report tab: month-wise orders/revenue breakdown, activity stats, PDF download button
- New Tab type: `"monthly-report"` in AdminPage Tab union

### Modify
- `ADMIN_PASSWORD` constant in AdminPage.tsx: change from `"Admin@123"` to `"Nextgen@2017"`
- Header component: add "Admin Panel" nav link that calls `navigate('admin')`
- Dashboard tab: replace placeholder with real stats pulled from localStorage (orders, products, jobs)

### Remove
- Nothing removed

## Implementation Plan
1. In AdminPage.tsx: change `ADMIN_PASSWORD` from `"Admin@123"` to `"Nextgen@2017"`
2. Add `"monthly-report"` to the Tab union type in AdminPage.tsx
3. Build proper Dashboard tab UI: stats cards (Total Orders, Total Revenue, Total Products, Active Jobs, Recent Orders list)
4. Build Monthly Report tab: group orders by month, show revenue per month, bar/table view, PDF download via window.print() or jsPDF
5. In Header component (src/frontend/src/components/Header.tsx): add "Admin Panel" nav link that calls navigate('admin')
