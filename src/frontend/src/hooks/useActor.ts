/**
 * useActor.ts
 *
 * Wraps the real useActor from @caffeineai/core-infrastructure,
 * wiring it to the project's createActor factory from backend.ts.
 */

import { useActor as _useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";

export interface UseActorResult {
  actor: backendInterface | null;
  isFetching: boolean;
}

export function useActor(): UseActorResult {
  // Pass createActor as the factory — the hook handles identity, caching, and re-creation.
  const result = _useActor(createActor);
  return {
    actor: (result.actor as backendInterface | null) ?? null,
    isFetching: result.isFetching,
  };
}
