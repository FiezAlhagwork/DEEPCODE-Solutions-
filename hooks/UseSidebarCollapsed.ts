"use client";

import { useSyncExternalStore } from "react";

// The collapsed/expanded preference has to survive reloads, so it lives in
// `localStorage`. It is read through `useSyncExternalStore` — the same approach
// as `hooks/UseMobile.ts` — rather than an effect that calls `setState`, which
// would both flag under the project's `react-hooks/set-state-in-effect` rule and
// render one frame with the wrong width.
//
// `getServerSnapshot` returns `false`, so the server (and the hydration pass)
// always renders the expanded sidebar; React swaps in the stored value right
// after hydration without a mismatch.

const STORAGE_KEY = "deepcode:admin-sidebar-collapsed";

let listeners: (() => void)[] = [];

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.push(onStoreChange);
  // Keeps two open tabs in sync.
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners = listeners.filter((listener) => listener !== onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private mode or blocked site data — fall back to expanded.
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export function setSidebarCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // Ignore — the toggle still works for this session via the re-render below.
  }
  emit();
}

export function useSidebarCollapsed() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
