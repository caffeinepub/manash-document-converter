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
 */

import type { backendInterface } from "../backend";

// Module-level actor reference, set during app initialization
let _actor: backendInterface | null = null;

/**
 * Set the actor reference. Called from App.tsx once the actor is available.
 */
export function setStorageActor(actor: backendInterface | null) {
  _actor = actor;
}

/**
 * Save data to BOTH localStorage and the backend (fire-and-forget for backend).
 * Falls back gracefully if backend is unavailable.
 */
export async function setAdminData(key: string, value: string): Promise<void> {
  // Always write to localStorage immediately for instant UI updates
  localStorage.setItem(key, value);

  // Fire-and-forget to backend; don't block UI
  if (_actor) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (_actor as any).setAdminSetting(key, value);
    } catch (e) {
      // Backend save failed — localStorage still has the data
      console.warn("[adminStorage] Backend save failed for key:", key, e);
    }
  }
}

/**
 * Sync all backend admin settings into localStorage.
 * Call this once on app mount so existing getItem() calls pick up backend data.
 */
export async function syncFromBackend(actor: backendInterface): Promise<void> {
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
    }
  } catch (e) {
    // Backend sync failed — app will fall back to existing localStorage data
    console.warn("[adminStorage] Backend sync failed:", e);
  }
}
