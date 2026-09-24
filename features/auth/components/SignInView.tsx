"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import Button from "@/components/kit/Button";
import Field from "@/components/kit/Field";
import TextInput from "@/components/kit/TextInput";
import { Link, useRouter } from "@/i18n/navigation";
import { createCodeSchema, createSignInEmailSchema } from "../schemas/Auth";
import {
  authPageHref,
  clerkErrorMessage,
  clerkFieldError,
  withTimeout,
} from "../utils/Auth";
import CodeInput from "./CodeInput";
import GoogleButton from "./GoogleButton";
import type { AuthViewProps } from "../types/Auth";

type Step = "identifier" | "code";

export default function SignInView({ locale, returnTo }: AuthViewProps) {
  const t = useTranslations("auth.signIn");
  const tCommon = useTranslations("auth.common");
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("identifier");
  const [email, setEmail] = useState("");
  const [emailAddressId, setEmailAddressId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailSchema = useMemo(() => createSignInEmailSchema(tCommon), [tCommon]);
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const codeSchema = useMemo(() => createCodeSchema(tCommon), [tCommon]);
  const codeForm = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function handleGoogle() {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `/${locale}/sso-callback`,
        redirectUrlComplete: `/${locale}${returnTo ?? "/admin"}`,
      });
    } catch (error) {
      // Without this, a failed redirect (Clerk rejects the attempt for any
      // reason) left the button looking like it did nothing at all.
      toast.error(clerkErrorMessage(error, tCommon("genericError")));
    }
  }

  async function onSubmitEmail({ email: identifier }: { email: string }) {
    if (!isLoaded) return;
    setSubmitting(true);
    try {
      const attempt = await withTimeout(
        signIn.create({ identifier }),
        tCommon("timeoutError"),
      );
      const emailFactor = attempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code",
      ) as { strategy: "email_code"; emailAddressId: string } | undefined;

      if (!emailFactor) {
        toast.error(tCommon("genericError"));
        return;
      }

      await withTimeout(
        signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        }),
        tCommon("timeoutError"),
      );
      setEmail(identifier);
      setEmailAddressId(emailFactor.emailAddressId);
      setStep("code");
    } catch (error) {
      const fieldError = clerkFieldError(error, "identifier");
      if (fieldError) emailForm.setError("email", { message: fieldError });
      else toast.error(clerkErrorMessage(error, tCommon("genericError")));
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmitCode({ code }: { code: string }) {
    if (!isLoaded) return;
    setSubmitting(true);
    try {
      const attempt = await withTimeout(
        signIn.attemptFirstFactor({ strategy: "email_code", code }),
        tCommon("timeoutError"),
      );
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push(returnTo ?? "/admin");
        return;
      }
      toast.error(tCommon("genericError"));
    } catch (error) {
      const fieldError = clerkFieldError(error, "code");
      if (fieldError) codeForm.setError("code", { message: fieldError });
      else toast.error(clerkErrorMessage(error, tCommon("genericError")));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!isLoaded || !emailAddressId) return;
    try {
      await withTimeout(
        signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId }),
        tCommon("timeoutError"),
      );
      toast.success(tCommon("codeResent"));
    } catch (error) {
      toast.error(clerkErrorMessage(error, tCommon("genericError")));
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-hairline bg-surface-1 p-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {step === "identifier" ? t("subtitle") : tCommon("codeSentTo", { email })}
        </p>
      </div>

      {step === "identifier" ? (
        <form
          onSubmit={emailForm.handleSubmit(onSubmitEmail)}
          className="flex flex-col gap-4"
        >
          <Field
            htmlFor="email"
            label={tCommon("emailLabel")}
            error={emailForm.formState.errors.email?.message}
          >
            <TextInput
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              autoFocus
              {...emailForm.register("email")}
            />
          </Field>
          {/* `loading` covers `!isLoaded` too: until Clerk's SDK has booted,
              every handler here returns early, and a button that silently does
              nothing on click is indistinguishable from a broken one. */}
          <Button
            type="submit"
            variant="primary"
            loading={submitting || !isLoaded}
            className="w-full"
          >
            {tCommon("continueButton")}
          </Button>

          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <span className="h-px flex-1 bg-hairline" />
            {tCommon("orDivider")}
            <span className="h-px flex-1 bg-hairline" />
          </div>
          <GoogleButton onContinue={handleGoogle} disabled={submitting || !isLoaded} />
        </form>
      ) : (
        <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="flex flex-col gap-4">
          <Controller
            control={codeForm.control}
            name="code"
            render={({ field }) => (
              <Field
                htmlFor="code"
                label={tCommon("codeLabel")}
                error={codeForm.formState.errors.code?.message}
              >
                <CodeInput
                  id="code"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={codeForm.formState.errors.code !== undefined}
                />
              </Field>
            )}
          />
          <Button
            type="submit"
            variant="primary"
            loading={submitting || !isLoaded}
            className="w-full"
          >
            {tCommon("verifyButton")}
          </Button>
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setStep("identifier")}
              className="text-ink-muted hover:text-ink"
            >
              {t("changeEmail")}
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:text-primary/80"
            >
              {tCommon("resendCode")}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-xs text-ink-muted">
        {t("noAccount")}{" "}
        <Link
          href={authPageHref("/sign-up", returnTo)}
          className="text-primary hover:text-primary/80"
        >
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
