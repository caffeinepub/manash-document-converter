# NextGen-manash-pc-World-2.0

## Current State
- Entertainment Hub at `/entertainment` has a Music Library sub-section (MusicLibrary component inside EntertainmentPage.tsx)
- Current Music Library: YouTube embed player, categories (Bihu, Folk, Movie, Devotional, Modern, Zubeen Garg), search, A-Z sort, expandable song cards with YouTube iframe embed
- MusicCategoryPage.tsx: "More Songs" page opened in new tab per category, has 220+ songs with YouTube IDs, singer-grouped with sticky A-Z nav
- Admin Panel (AdminPage.tsx) has Entertainment > Music tab: CRUD for songs with fields: id, title, artist, category, youtubeId
- ImageToolsPage.tsx: Background Removal tool uses `@imgly/background-removal` (client-side AI) — currently broken/slow. No remove.bg API integration.

## Requested Changes (Diff)

### Add
- New song fields: `singerName`, `movieName`, `genre`, `releaseDate`, `platformLink` (replaces `youtubeId`), `lyrics` (multiline text)
- Music Library browse view: THREE tabs — By Category, By Singer (A-Z), By Movie — all browseable
- "More Info" button on each song card (blue, white font) that expands/shows lyrics below the song details
- Admin Panel: update Music Songs tab to support new fields including a Lyrics textarea for each song
- Background Removal tool: replace `@imgly/background-removal` with remove.bg API (`UputND68rsXjraZifg5jTM7d`) via fetch call
- Pre-load 30+ real Assamese songs with real platform links (YouTube), singer names, movie names, release dates — NO Hindi/Bollywood content

### Modify
- MusicSong interface: replace `youtubeId: string` with `platformLink: string`, add `singerName`, `movieName`, `genre`, `releaseDate`, `lyrics` fields
- Music Library in EntertainmentPage: replace YouTube embed player with external link redirect (open platformLink in new tab), add three browse tabs
- MusicCategoryPage.tsx (More Songs page): replace YouTube embed with external link, add singer/movie browse tabs, update song data to use new fields
- Admin Music tab: update form fields to include singerName, movieName, genre, releaseDate, platformLink, lyrics textarea
- DEFAULT_MUSIC_SONGS / DEFAULT_MUSIC_SONGS_ADMIN: replace all old data with real Assamese songs only (no Bollywood), with real YouTube links as platformLink
- Background removal in ImageToolsPage: replace @imgly import with remove.bg REST API call using key `UputND68rsXjraZifg5jTM7d`

### Remove
- YouTube iframe embed from song cards (replaced by external link button)
- `youtubeId` field from song interfaces (replaced by `platformLink`)
- All non-Assamese / placeholder / Hindi/Bollywood songs from default data

## Implementation Plan

1. **Update MusicSong interface** in EntertainmentPage.tsx and MusicCategoryPage.tsx:
   - Remove `youtubeId`, add `singerName`, `movieName`, `genre`, `releaseDate`, `platformLink`, `lyrics`

2. **Replace DEFAULT_MUSIC_SONGS** with 30+ real Assamese songs across all categories:
   - Bihu: O Mur Apunar Desh, Bihu Bihu (Zubeen Garg), Tumi Aahibane, etc.
   - Folk: Mur Ghar Suwali, Husori, etc.
   - Movie: Mayabini (Yaone, Zubeen Garg), Rongmon, Kopou Phool, etc.
   - Devotional: Jai Kamakhya, Naam Kirtan, etc.
   - Modern: Kuwori Baa (Neel Akash), Chenehi Morom, etc.
   - Zubeen Garg: Dil Dil Assam, Moi Eti Jajabor, Aai, O Pori, etc.
   - Each with real YouTube URL as platformLink, singer name, movie name where applicable

3. **Update MusicLibrary component** in EntertainmentPage.tsx:
   - Replace YouTube embed expand panel with:
     - Collapsible "More Info" section showing lyrics (if available)
     - External "Play" button linking to platformLink in new tab
   - Add 3 browse tabs at top: "By Category" | "By Singer" | "By Movie"
   - "By Singer" tab: groups songs A-Z by singerName
   - "By Movie" tab: groups songs by movieName (only songs with a movie)
   - "By Category" tab: existing category filter behavior

4. **Update MusicCategoryPage.tsx** (More Songs new-tab page):
   - Update ExtendedSong interface to new fields
   - Replace YouTube embed with platform link button
   - Update song data to all-Assamese with real links
   - Keep singer-grouped A-Z navigation

5. **Update Admin Panel** music tab in AdminPage.tsx:
   - Update MusicSongAdmin interface to match new fields
   - Add form fields: singerName, movieName, genre, releaseDate, platformLink, lyrics (textarea)
   - Update DEFAULT_MUSIC_SONGS_ADMIN to match new data

6. **Fix Background Removal** in ImageToolsPage.tsx:
   - Replace `@imgly/background-removal` dynamic import with remove.bg REST API:
     ```
     POST https://api.remove.bg/v1.0/removebg
     Headers: X-Api-Key: UputND68rsXjraZifg5jTM7d
     Body: FormData with image_file
     Response: blob (PNG with transparent background)
     ```
   - Update progress text to reflect API call instead of model loading
   - Handle errors with toast.error
