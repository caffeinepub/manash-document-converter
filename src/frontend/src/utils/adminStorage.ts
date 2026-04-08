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
 * KEY FIX: Retry backend save up to 3 times on failure.
 */

import type { backendInterface } from "../backend";

// Module-level actor reference, set during app initialization
let _actor: backendInterface | null = null;

// Pending write queue — flushed when actor becomes available
const _pendingWrites: Array<{ key: string; value: string }> = [];

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
  if (actor && _pendingWrites.length > 0) {
    const toFlush = _pendingWrites.splice(0, _pendingWrites.length);
    for (const { key, value } of toFlush) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (actor as any).setAdminSetting(key, value).catch((e: unknown) => {
          console.warn("[adminStorage] Flush write failed for key:", key, e);
        });
      } catch (e) {
        console.warn("[adminStorage] Flush write error for key:", key, e);
      }
    }
  }
}

/**
 * Force-update the actor reference (used when actor changes due to login).
 * Unlike setStorageActor, this always overwrites even with null.
 */
export function forceSetStorageActor(actor: backendInterface | null) {
  _actor = actor;
  if (actor && _pendingWrites.length > 0) {
    const toFlush = _pendingWrites.splice(0, _pendingWrites.length);
    for (const { key, value } of toFlush) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (actor as any).setAdminSetting(key, value).catch((e: unknown) => {
          console.warn("[adminStorage] Flush write failed for key:", key, e);
        });
      } catch (e) {
        console.warn("[adminStorage] Flush write error for key:", key, e);
      }
    }
  }
}

/**
 * Save data to BOTH localStorage and the backend (with retry).
 * Falls back gracefully if backend is unavailable.
 * If actor is not ready, queues the write for later.
 */
export async function setAdminData(key: string, value: string): Promise<void> {
  // Always write to localStorage immediately for instant UI updates
  localStorage.setItem(key, value);

  if (_actor) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (_actor as any).setAdminSetting(key, value);
        return; // success
      } catch (e) {
        console.warn(
          `[adminStorage] Backend save failed (attempt ${attempt}/${MAX_RETRIES}) for key:`,
          key,
          e,
        );
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          throw e; // re-throw after all retries exhausted
        }
      }
    }
  } else {
    // Actor not ready yet — queue for later flush
    _pendingWrites.push({ key, value });
  }
}

/**
 * Sync all backend admin settings into localStorage.
 * Retries up to 5 times with increasing delay on failure.
 * Call this once on app mount so existing getItem() calls pick up backend data.
 */
export async function syncFromBackend(actor: backendInterface): Promise<void> {
  const MAX_RETRIES = 5;
  const RETRY_DELAYS_MS = [1000, 2000, 3000, 4000, 5000];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const settings: [string, string][] = await (
        actor as any
      ).getAllAdminSettings();
      if (Array.isArray(settings)) {
        for (const [key, value] of settings) {
          if (key && value !== undefined) {
            localStorage.setItem(key, value);
          }
        }
        console.log(
          `[adminStorage] Synced ${settings.length} settings from backend.`,
        );
      }
      return; // success — exit
    } catch (e) {
      console.warn(
        `[adminStorage] Backend sync failed (attempt ${attempt}/${MAX_RETRIES}):`,
        e,
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAYS_MS[attempt - 1] ?? 3000),
        );
      }
    }
  }
  // All retries exhausted — app falls back to existing localStorage data
  console.warn(
    "[adminStorage] All sync retries exhausted. Using local data only.",
  );
}
