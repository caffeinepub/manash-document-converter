# DocConvert

## Current State
New project, no existing application files.

## Requested Changes (Diff)

### Add
- Document format converter web app
- Support conversions: JPG→PDF, PDF→JPG, JPG→PNG, PNG→JPG, PNG→PDF, PDF→PNG
- Drag-and-drop file upload area
- Format selection (input and output format auto-detected or user-selectable)
- Client-side conversion using browser APIs + libraries (pdf-lib, pdfjs-dist)
- Download converted file button
- Conversion history/progress indicator

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Frontend-only app (no backend needed for conversions)
2. Use pdf-lib for image→PDF conversion
3. Use pdfjs-dist for PDF→image conversion
4. Use Canvas API for JPG↔PNG conversions
5. Drag-and-drop upload zone with file type detection
6. Conversion panel showing supported output formats based on input
7. Download button after conversion completes
