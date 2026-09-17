import { useState } from "react";

import type { ConfirmableMutation, ConfirmedAction } from "@/types/Admin";

/**
 * Holds the record a confirmation dialog is asking about, and runs the
 * mutation when it is confirmed.
 *
 * Thin on purpose — the value is the two rules it makes automatic, both of
 * which had to be written by hand (and got written slightly differently) in
 * each of the three admin tables:
 *
 * - the dialog cannot be dismissed while the mutation is in flight, and
 * - it closes on success only, so a refusal stays on screen next to the toast
 *   that explains it rather than vanishing as though the action had worked.
 */
export function useConfirmedAction<TRecord>(
  mutation: ConfirmableMutation,
  getId: (record: TRecord) => string,
): ConfirmedAction<TRecord> {
  const [target, setTarget] = useState<TRecord | null>(null);

  return {
    target,
    isPending: mutation.isPending,
    ask: setTarget,
    dismiss: () => {
      if (!mutation.isPending) setTarget(null);
    },
    confirm: () => {
      if (!target) return;
      mutation.mutate(getId(target), { onSuccess: () => setTarget(null) });
    },
  };
}
