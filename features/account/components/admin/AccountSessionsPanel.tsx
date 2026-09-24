"use client";

import { useSession } from "@clerk/nextjs";
import { MonitorSmartphone } from "lucide-react";
import { useNow, useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import EmptyState from "@/components/kit/EmptyState";
import { FormSection } from "@/components/kit/FormLayout";
import Modal from "@/components/kit/Modal";
import { clerkErrorMessage } from "@/features/auth/utils/Auth";
import { useConfirmedAction } from "@/hooks/UseConfirmedAction";
import { useAccountSessions, useRevokeSession } from "../../hooks/UseAccount";
import type { AccountSessionView } from "../../types/Account";
import { isActiveSession, toAccountSessionView } from "../../utils/Account";
import AccountSessionCard from "./AccountSessionCard";

/** Enough to fill the list while it loads without pretending to know the count. */
const SKELETON_CARDS = 2;

/** "Last active" is minute-resolution, so re-reading the clock any faster is waste. */
const CLOCK_TICK_MS = 60_000;

export default function AccountSessionsPanel() {
  const t = useTranslations("admin.account");
  const tCommon = useTranslations("admin.common");
  const { session: currentSession } = useSession();
  // One clock for the whole list rather than one per card. Passing it to
  // `relativeTime` is also what silences next-intl's `ENVIRONMENT_FALLBACK`
  // error, which it logs on every render when `now` is left out.
  const now = useNow({ updateInterval: CLOCK_TICK_MS });

  const sessionsQuery = useAccountSessions();
  const revokeSession = useRevokeSession();
  const revoke = useConfirmedAction(
    revokeSession,
    (session: AccountSessionView) => session.id,
  );

  const sessions = (sessionsQuery.data ?? [])
    .filter(isActiveSession)
    .map((session) =>
      toAccountSessionView(session, currentSession?.id, t),
    )
    // This device first, then whatever was used most recently — the order
    // someone scanning for "what is that other machine" actually wants.
    .sort((a, b) => {
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      return b.lastActiveAt.getTime() - a.lastActiveAt.getTime();
    });

  return (
    <>
      <FormSection
        title={t("sessionsTitle")}
        description={t("sessionsDescription")}
      >
        {sessionsQuery.isPending ? (
          <div className="flex flex-col gap-3" aria-busy>
            <span className="sr-only">{tCommon("loading")}</span>
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-surface-3"
              />
            ))}
          </div>
        ) : sessionsQuery.isError ? (
          // Not an `ApiError` — this list comes from the Clerk SDK, so the
          // message is extracted the way the auth views extract theirs.
          <EmptyState
            icon={MonitorSmartphone}
            title={tCommon("loadError", {
              message: clerkErrorMessage(
                sessionsQuery.error,
                tCommon("noResults"),
              ),
            })}
          />
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={MonitorSmartphone}
            title={t("sessionsEmpty")}
          />
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {sessions.map((session) => (
                <AccountSessionCard
                  key={session.id}
                  session={session}
                  onRevoke={revoke.ask}
                  isRevoking={
                    revoke.isPending && revoke.target?.id === session.id
                  }
                  now={now}
                />
              ))}
            </ul>

            {/* Clerk invalidates the session immediately, but the other device
                only finds out when it next refreshes its token — about a
                minute. That applies to our own backend too, which verifies the
                JWT locally and will keep accepting the old one until it
                expires. Without this line the button looks like it failed. */}
            <p className="text-xs text-ink-faint">{t("revokeDelayNote")}</p>
          </>
        )}
      </FormSection>

      {/* `useConfirmedAction` owns the two rules here: the dialog can't be
          dismissed mid-flight, and it closes on success only — so a refusal
          stays on screen beside the toast that explains it. */}
      <Modal
        open={revoke.target !== null}
        onClose={revoke.dismiss}
        closeLabel={tCommon("cancel")}
        title={t("revokeTitle")}
        description={
          revoke.target
            ? `${revoke.target.device} — ${t("revokeDescription")}`
            : undefined
        }
        footer={
          <>
            <Button
              variant="ghost"
              disabled={revoke.isPending}
              onClick={revoke.dismiss}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="danger"
              loading={revoke.isPending}
              onClick={revoke.confirm}
            >
              {t("revoke")}
            </Button>
          </>
        }
      />
    </>
  );
}
