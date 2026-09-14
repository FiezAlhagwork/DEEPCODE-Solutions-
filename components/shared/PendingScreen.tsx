import { Loader2 } from "lucide-react";

import type { PendingScreenProps } from "@/types/Shared";

// The shared body of every `loading.tsx` in the app, so the three of them
// don't each re-describe the same centered spinner. It renders no chrome of
// its own — whichever layout owns the segment is already around it.

export default function PendingScreen({ message }: PendingScreenProps) {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3"
    >
      <Loader2 className="size-6 animate-spin text-ink-faint" aria-hidden />
      {message && <p className="text-sm text-ink-muted">{message}</p>}
    </div>
  );
}
