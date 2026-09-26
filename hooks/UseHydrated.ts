import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` on the server and during hydration, `true` after. For output that
 * the server cannot render identically to the browser — anything built from
 * `Intl` data, whose country names and sort order differ between Node's ICU
 * and the browser's. Read through `useSyncExternalStore`, like
 * `UseSidebarCollapsed`, rather than a mount effect that sets state.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
