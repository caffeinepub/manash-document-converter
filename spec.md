# Manash PC World 2.0

## Current State
- `/assam-forms` page (`AssamFormsPage.tsx`) displays ~50+ government PDF forms in a card grid
- Each `FormCard` has: category badge, title, description, language tag, file size, and a gold **Download PDF** button
- No "More Info" button exists currently
- No form-specific guidelines pages exist

## Requested Changes (Diff)

### Add
- **"More Info" button** on every form card — blue background (`bg-blue-600`), white font, placed next to the Download PDF button
- **`FormGuidelinesPage` component** — a new page/route that opens in a **new browser tab** (`window.open`) showing detailed English guidelines for a specific form
- **Guidelines data map** — a data object keyed by form `id`, containing for each form:
  - What is this form?
  - Who can apply?
  - Documents required
  - Step-by-step how to fill
  - Where to submit
  - Fee details
- All 50+ default forms must have their own dedicated guidelines content

### Modify
- `FormCard` component — add the blue "More Info" button that calls `window.open('/form-guide?id=<formId>', '_blank')`
- `App.tsx` or router — add route for `/form-guide` page

### Remove
- Nothing removed

## Implementation Plan
1. Create a `formGuidelines` data map in a new file `src/frontend/src/data/formGuidelines.ts` with detailed English guidelines for all 50+ forms
2. Create `FormGuidePage.tsx` — reads `?id=` query param, looks up the guidelines, renders a clean well-structured page with sections: What is this form, Who can apply, Documents required, Step-by-step guide, Where to submit, Fee
3. Update `AssamFormsPage.tsx` `FormCard` component — add blue "More Info" button next to Download PDF, clicking it calls `window.open('/form-guide?id=' + form.id, '_blank')`
4. Register `/form-guide` route in App.tsx
5. Validate and deploy
