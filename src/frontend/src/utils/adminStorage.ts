/**
 * adminStorage.ts
 *
 * Persistent admin data storage that saves to BOTH localStorage (fast/local)
 * and the on-chain backend (permanent, cross-device).
 *
 * Pattern:
 * - setAdminData: saves to localStorage immediately, then async to backend
 * - syncFromBackend: on app load, pulls all backend data into localStorage
 *   so existing localStorage.getItem() calls work automatically
 *
 * KEY FIX: Never overwrite a valid actor with null.
 * KEY FIX: Retry backend save up to 5 times with exponential backoff.
 * KEY FIX: Queue writes when actor not ready, flush on actor set.
 */

import type { backendInterface } from "../backend";

// Module-level actor reference, set during app initialization
let _actor: backendInterface | null = null;

// Pending write queue — flushed when actor becomes available
const _pendingWrites: Array<{ key: string; value: string }> = [];

// Save status for UI indicator
type SaveStatus = "idle" | "saving" | "saved" | "queued" | "error";
let _saveStatus: SaveStatus = "idle";

export function getSaveStatus(): SaveStatus {
  return _saveStatus;
}

/**
 * Flush all pending writes to backend now that actor is ready.
 */
function flushPendingWrites(actor: backendInterface): void {
  if (_pendingWrites.length === 0) return;
  const toFlush = _pendingWrites.splice(0, _pendingWrites.length);
  for (const { key, value } of toFlush) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (actor as any)
      .setAdminSetting(key, value)
      .catch((e: unknown) =>
        console.warn("[adminStorage] Flush write failed for key:", key, e),
      );
  }
}

/**
 * Set the actor reference. Called from App.tsx once the actor is available.
 * IMPORTANT: Never overwrite a valid actor with null — if actor is currently
 * set and new value is null, skip (prevents race conditions on re-render).
 * Also flushes any pending writes that were queued before actor was ready.
 */
export function setStorageActor(actor: backendInterface | null) {
  // Never downgrade from a valid actor to null
  if (actor === null && _actor !== null) {
    return;
  }
  _actor = actor;
  if (actor) {
    flushPendingWrites(actor);
  }
}

/**
 * Force-update the actor reference (used when actor is definitively available).
 * Unlike setStorageActor, this always sets a non-null actor (but still never
 * sets to null to avoid accidental erasure).
 */
export function forceSetStorageActor(actor: backendInterface | null) {
  if (actor === null) {
    // Never force-set to null — it would erase a valid actor
    return;
  }
  _actor = actor;
  flushPendingWrites(actor);
}

/**
 * Save data to BOTH localStorage and the backend (with exponential backoff retry).
 * Falls back gracefully if backend is unavailable.
 * If actor is not ready, queues the write for later flush.
 */
export async function setAdminData(key: string, value: string): Promise<void> {
  // Always write to localStorage immediately for instant UI updates
  localStorage.setItem(key, value);

  if (!_actor) {
    // Actor not ready yet — queue for later flush
    _pendingWrites.push({ key, value });
    _saveStatus = "queued";
    return;
  }

  const MAX_RETRIES = 5;
  const RETRY_DELAYS_MS = [200, 400, 800, 1600, 3200];

  _saveStatus = "saving";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (_actor as any).setAdminSetting(key, value);
      _saveStatus = "saved";
      return; // success
    } catch (e) {
      console.warn(
        `[adminStorage] Backend save failed (attempt ${attempt}/${MAX_RETRIES}) for key:`,
        key,
        e,
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAYS_MS[attempt - 1] ?? 1600),
        );
      } else {
        _saveStatus = "error";
        throw e; // re-throw after all retries exhausted
      }
    }
  }
}

/**
 * Sync all backend admin settings into localStorage.
 * Retries up to 5 times with exponential backoff on failure.
 * Call this once on app mount so existing getItem() calls pick up backend data.
 * Each key-value pair is written to localStorage immediately as received.
 */
export async function syncFromBackend(actor: backendInterface): Promise<void> {
  const MAX_RETRIES = 5;
  const RETRY_DELAYS_MS = [200, 400, 800, 1600, 3200];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const settings: [string, string][] = await (
        actor as any
      ).getAllAdminSettings();

      // Handle empty response gracefully (new users have no saved settings)
      if (!Array.isArray(settings) || settings.length === 0) {
        console.log(
          "[adminStorage] No backend settings found (new user). Using defaults.",
        );
        localStorage.setItem("lastSyncTime", String(Date.now()));
        return;
      }

      // Write each pair immediately to localStorage as it arrives
      for (const [key, value] of settings) {
        if (key && value !== undefined) {
          localStorage.setItem(key, value);
        }
      }

      localStorage.setItem("lastSyncTime", String(Date.now()));
      console.log(
        `[adminStorage] Synced ${settings.length} settings from backend.`,
      );
      return; // success — exit
    } catch (e) {
      console.warn(
        `[adminStorage] Backend sync failed (attempt ${attempt}/${MAX_RETRIES}):`,
        e,
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAYS_MS[attempt - 1] ?? 1600),
        );
      }
    }
  }

  // All retries exhausted — app falls back to existing localStorage data
  console.warn(
    "[adminStorage] All sync retries exhausted. Using local data only.",
  );
}
