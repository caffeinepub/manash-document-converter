# Manash PC World 2.0

## Current State
- AdminPage has tabs: dashboard, products, orders, settings, job-updates
- GovDocumentsPage shows static hardcoded document list with guides (Aadhaar, PAN, Driving Licence, Birth Certificate, Passport, Voter ID, Caste, Ration Card, Land Records, GST)
- No admin interface exists for managing government documents
- AiChatPage uses OpenAI API key `28f42369-c34a-4804-8657-f36363c9b67f` which appears to be a non-standard format — should use Gemini as fallback since OpenAI keys must start with `sk-`
- types.ts has Job, AdmitCard, JobResult types and CRUD functions

## Requested Changes (Diff)

### Add
- `GovDoc` type and related storage functions in types.ts
- `gov-documents` tab in AdminPage with full CRUD for document entries
- Admin can add/edit/delete document cards shown on GovDocumentsPage
- Fallback to Gemini API in chatbot when OpenAI returns auth error

### Modify
- AdminPage: add `gov-documents` tab
- types.ts: add GovDoc interface, seed data, get/save functions
- GovDocumentsPage: read document list from localStorage (admin-managed) instead of hardcoded constant, with hardcoded as fallback seed
- AiChatPage: fix chatbot — if OpenAI fails with 401/auth error, auto-fallback to Gemini API (key: AIzaSyCLjvyMd0-jeQBGRjkD9c1JgAv77niQXC8) using gemini-2.0-flash

### Remove
- Nothing removed

## Implementation Plan
1. Add GovDocAdmin type to types.ts with id, title, subtitle, description, category, actions (label+url array), hasGuide flag
2. Add SEED_GOV_DOCS, getGovDocs(), saveGovDocs() to types.ts
3. Add gov-documents tab to AdminPage with table, Add/Edit/Delete dialogs
4. Update GovDocumentsPage to load docs from getGovDocs() and use admin-managed data
5. Fix AiChatPage: if OpenAI 401/auth error, fallback to Gemini streaming API
