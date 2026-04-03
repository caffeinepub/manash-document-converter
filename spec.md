# NextGen-manash-pc-World-2.0

## Current State

The Music Library in `EntertainmentPage.tsx` has:
- `MusicSong` interface with fields: id, title, singerName, movieName, category, genre, releaseDate, platformLink, youtubeVideoId, lyrics, composer, lyricist, musicDirector, label, audioFileUrl, downloadLink, coverImage
- Browse tabs: By Category, By Singer, By Movie
- `SongCard` component that shows song details, YouTube embed, lyrics, download link in an expandable panel
- `MusicCategoryPage.tsx` — standalone page for "More Songs" with 220+ extended songs per category
- Admin panel has all song fields including `coverImage` and `youtubeVideoId`

**Current problems:**
1. Song cards do NOT prominently show cover photo — coverImage field exists but is not used prominently
2. Tab filtering issue — songs from one artist (e.g. Zubeen Garg) may appear in multiple category tabs
3. Each song category/singer/movie does NOT open a dedicated new tab page with all details
4. Clicking a song category button does not open a new tab — it filters inline

## Requested Changes (Diff)

### Add
- **Prominent cover photo** on every song card: large cover image displayed at top of card (16:9 or square aspect ratio). If no coverImage, use YouTube thumbnail `https://img.youtube.com/vi/{videoId}/hqdefault.jpg` as fallback. If no YouTube ID either, show a stylized placeholder with music note icon.
- **Each category/singer/movie button opens a new tab** — when user clicks a Category card (e.g. "Bihu"), Singer name (e.g. "Zubeen Garg"), or Movie name — it opens a NEW browser tab with a dedicated full page showing all songs for that selection, with cover photos, full details, YouTube embed, lyrics, download links
- **New dedicated song detail page** — `/music-detail` route that accepts query params `?id=songId` and shows full song page: large cover photo, YouTube embed, all metadata, lyrics, download link
- **New tab navigation pages** — `/music-songs?cat=Bihu`, `/music-songs?singer=Zubeen+Garg`, `/music-songs?movie=Yaone` — these pages render a full list of songs filtered by the param, each with cover photo card, "More Info" expanding to full details inline

### Modify
- **`SongCard` component** — redesign to show:
  - Top: large cover image (full width of card, ~200px tall, object-cover)
  - Below: song title (bold), singer name, movie name (if any), category badge
  - Bottom: two action buttons — "Play" (opens YouTube embed or audio) and "More Info" (opens new tab with song detail page)
- **Tab filtering fix** — when Zubeen Garg category tab is selected, show ONLY songs with `category === "Zubeen Garg"`. When Bihu is selected, show ONLY `category === "Bihu"`. No cross-category mixing. The A-Z Singer tab shows all songs by that specific singer regardless of category.
- **Category card buttons** — clicking now calls `window.open('/music-songs?cat=CATEGORY', '_blank')` instead of filtering inline
- **Singer buttons** — clicking calls `window.open('/music-songs?singer=SINGER_NAME', '_blank')`
- **Movie buttons** — clicking calls `window.open('/music-songs?movie=MOVIE_NAME', '_blank')`
- **`MusicCategoryPage.tsx`** — update to handle all three query params: `cat`, `singer`, `movie`. Also update song cards to use the same new prominent cover photo design.

### Remove
- Inline category song list view (the inline filtered view after clicking a category card) — replace with new-tab navigation
- Old "More Songs" button at bottom (its function is now replaced by the new-tab category/singer/movie page approach)

## Implementation Plan

1. **Add `/music-songs` route** in `App.tsx` pointing to a new `MusicSongsPage` component (or reuse/refactor `MusicCategoryPage`)
2. **Refactor `MusicCategoryPage.tsx`** to accept `cat`, `singer`, or `movie` query params and show appropriate filtered song list with the new card design
3. **Redesign `SongCard`** in both `EntertainmentPage.tsx` and `MusicCategoryPage.tsx`:
   - Top: cover image using coverImage || YouTube thumbnail || placeholder
   - Middle: title, singer, movie, category badge  
   - Bottom: "▶ Play" button + "ℹ More Info" button that opens new tab to `/music-songs?id=songId` or expands inline
4. **Fix tab filtering** in `EntertainmentPage.tsx` — category buttons now open new tab instead of filtering inline; singer/movie buttons also open new tab
5. **Keep inline browse tabs** (Category/Singer/Movie) in Entertainment page as navigation grids — clicking any item opens a new tab
6. **Update Admin panel** — no changes needed to admin song fields, but ensure `coverImage` field is visible and labeled clearly as "Cover Image URL"
7. **Add `/music-songs` to App.tsx router**
