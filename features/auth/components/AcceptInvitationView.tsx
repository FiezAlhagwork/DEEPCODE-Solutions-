"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs/legacy";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
// Query params are locale-agnostic, so this reads directly from `next/navigation`
// rather than `@/i18n/navigation` — that wrapper only exists to keep the
// locale prefix on hrefs/pathnames, which doesn't apply here.
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Button from "@/components/kit/Button";
import Field from "@/components/kit/Field";
import TextInput from "@/components/kit/TextInput";
import { useRouter } from "@/i18n/navigation";
import { createNameSchema } from "../schemas/Auth";
import {
  clerkErrorMessage,
  preparingHref,
  withTimeout,
} from "../utils/Auth";

type Phase = "loading" | "missingName" | "error";

/**
 * Clerk's ticket-based invitation acceptance IS `<SignUp>` under the hood —
 * the invite email's link carries a `__clerk_ticket` param that pre-verifies
 * identity, so there's no email-code step here, unlike `SignUpView`. The
 * invite only carries email + role metadata, not a name, so a short form
 * collects `firstName`/`lastName` when Clerk reports them as still missing.
 *
 * Unlike the other two views, this one takes no props: the ticket flow never
 * offers Google as an alternative (identity is already established by the
 * ticket), so it never needs `locale` to build an OAuth redirect URL.
 */
export default function AcceptInvitationView() {
  const t = useTranslations("auth.acceptInvitation");
  const tCommon = useTranslations("auth.common");
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticket = searchParams.get("__clerk_ticket");

  const [phase, setPhase] = useState<Phase>("loading");
  const [submitting, setSubmitting] = useState(false);

  const nameSchema = useMemo(() => createNameSchema(tCommon), [tCommon]);
  const nameForm = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName: "", lastName: "" },
  });

  // A ticket is single-use server-side, so this can't rely on the usual
  // "cancelled" cleanup-flag pattern: React's dev-mode Strict Mode fires this
  // effect twice on mount (mount → cleanup → mount again) on the very same
  // component instance, and a cleanup-flag guard only stops the *first* call's
  // result from being applied — it doesn't stop the *second* call from firing
  // and actually reaching Clerk. That second call then hits Clerk with an
  // already-consumed ticket and fails, which is exactly the bug this ref
  // guard (keyed by the ticket's own value, not a plain boolean) fixes: since
  // refs survive Strict Mode's synthetic remount, only the true first
  // invocation ever calls `signUp.create()`.
  const submittedTicketRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !ticket) return;
    if (submittedTicketRef.current === ticket) return;
    submittedTicketRef.current = ticket;

    (async () => {
      try {
        const attempt = await withTimeout(
          signUp.create({ strategy: "ticket", ticket }),
          tCommon("timeoutError"),
        );
        if (attempt.status === "complete") {
          await setActive({ session: attempt.createdSessionId });
          router.push(preparingHref());
          return;
        }
        setPhase("missingName");
      } catch (error) {
        toast.error(clerkErrorMessage(error, tCommon("genericError")));
        setPhase("error");
      }
    })();
    // `signUp`/`setActive`/`router`/`tCommon` are intentionally left out: the
    // ref guard above already ensures this body runs exactly once per ticket,
    // so re-running it over one of these references changing identity would
    // only ever be a no-op skip anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, ticket]);

  async function onSubmitName(values: { firstName: string; lastName: string }) {
    if (!isLoaded) return;
    setSubmitting(true);
    try {
      const attempt = await withTimeout(signUp.update(values), tCommon("timeoutError"));
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push(preparingHref());
        return;
      }
      toast.error(tCommon("genericError"));
    } catch (error) {
      toast.error(clerkErrorMessage(error, tCommon("genericError")));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-hairline bg-surface-1 p-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t("subtitle")}</p>
      </div>

      {/* Clerk runs its CAPTCHA check on every `signUp.create()` call,
          ticket strategy included — not just the regular sign-up form. It has
          to be in the DOM before the ticket effect below fires on mount, so
          it's rendered unconditionally here rather than inside any phase.
          Without it, Clerk falls back to an "Invisible CAPTCHA" that isn't
          reliable (this is why the first attempt worked and a later one
          didn't). */}
      <div id="clerk-captcha" />

      {!ticket && (
        <p className="text-center text-sm text-danger">{t("invalidLink")}</p>
      )}

      {ticket && phase === "loading" && (
        <Loader2 className="mx-auto size-6 animate-spin text-ink-faint" aria-hidden />
      )}

      {ticket && phase === "error" && (
        <p className="text-center text-sm text-danger">{tCommon("genericError")}</p>
      )}

      {ticket && phase === "missingName" && (
        <form onSubmit={nameForm.handleSubmit(onSubmitName)} className="flex flex-col gap-4">
          <p className="text-center text-xs text-ink-muted">{t("detailsSubtitle")}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              htmlFor="firstName"
              label={tCommon("firstNameLabel")}
              error={nameForm.formState.errors.firstName?.message}
            >
              <TextInput id="firstName" autoFocus {...nameForm.register("firstName")} />
            </Field>
            <Field
              htmlFor="lastName"
              label={tCommon("lastNameLabel")}
              error={nameForm.formState.errors.lastName?.message}
            >
              <TextInput id="lastName" {...nameForm.register("lastName")} />
            </Field>
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={submitting || !isLoaded}
            className="w-full"
          >
            {tCommon("continueButton")}
          </Button>
        </form>
      )}
    </div>
  );
}
