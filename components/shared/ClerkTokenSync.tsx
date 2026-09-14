"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setClerkTokenGetter } from "@/lib/ClerkTokenBridge";

/**
 * Renders nothing — its only job is registering `useAuth().getToken` with
 * `lib/ClerkTokenBridge.ts` so the shared axios instance can attach it to
 * every request. Mounted once, inside `<ClerkProvider>`, in the root locale
 * layout.
 */
export default function ClerkTokenSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(getToken);
    return () => setClerkTokenGetter(null);
  }, [getToken]);

  return null;
}
