"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs/legacy";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import Button from "@/components/kit/Button";
import Field from "@/components/kit/Field";
import TextInput from "@/components/kit/TextInput";
import { Link, useRouter } from "@/i18n/navigation";
import { createCodeSchema, createSignUpDetailsSchema } from "../schemas/Auth";
import {
  authPageHref,
  clerkErrorMessage,
  clerkFieldError,
  withTimeout,
} from "../utils/Auth";
import CodeInput from "./CodeInput";
import GoogleButton from "./GoogleButton";
import type { AuthViewProps } from "../types/Auth";

type Step = "details" | "code";

export default function SignUpView({ locale, returnTo }: AuthViewProps) {
  const t = useTranslations("auth.signUp");
  const tCommon = useTranslations("auth.common");
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const detailsSchema = useMemo(() => createSignUpDetailsSchema(tCommon), [tCommon]);
  const detailsForm = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  const codeSchema = useMemo(() => createCodeSchema(tCommon), [tCommon]);
  const codeForm = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function handleGoogle() {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
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

  async function onSubmitDetails(values: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    if (!isLoaded) return;
    setSubmitting(true);
    try {
      // `signUp.create()` is the call that waits on the Turnstile token, so it
      // is the one that can sit pending forever when the challenge never
      // resolves — the timeout is what turns that into a visible error.
      await withTimeout(
        signUp.create({
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.email,
        }),
        tCommon("timeoutError"),
      );
      await withTimeout(
        signUp.prepareEmailAddressVerification({ strategy: "email_code" }),
        tCommon("timeoutError"),
      );
      setEmail(values.email);
      setStep("code");
    } catch (error) {
      const fieldError = clerkFieldError(error, "email_address");
      if (fieldError) detailsForm.setError("email", { message: fieldError });
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
        signUp.attemptEmailAddressVerification({ code }),
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
    if (!isLoaded) return;
    try {
      await withTimeout(
        signUp.prepareEmailAddressVerification({ strategy: "email_code" }),
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
          {step === "details" ? t("subtitle") : tCommon("codeSentTo", { email })}
        </p>
      </div>

      {step === "details" ? (
        <form
          onSubmit={detailsForm.handleSubmit(onSubmitDetails)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field
              htmlFor="firstName"
              label={tCommon("firstNameLabel")}
              error={detailsForm.formState.errors.firstName?.message}
            >
              <TextInput id="firstName" autoFocus {...detailsForm.register("firstName")} />
            </Field>
            <Field
              htmlFor="lastName"
              label={tCommon("lastNameLabel")}
              error={detailsForm.formState.errors.lastName?.message}
            >
              <TextInput id="lastName" {...detailsForm.register("lastName")} />
            </Field>
          </div>
          <Field
            htmlFor="email"
            label={tCommon("emailLabel")}
            error={detailsForm.formState.errors.email?.message}
          >
            <TextInput
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              {...detailsForm.register("email")}
            />
          </Field>

          {/* Clerk's smart CAPTCHA auto-manages this widget by its id — it stays
              invisible unless a challenge is actually required. */}
          <div id="clerk-captcha" />

          {/* `loading` covers `!isLoaded` too — see the same note in SignInView. */}
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
          <button
            type="button"
            onClick={handleResend}
            className="self-center text-xs text-primary hover:text-primary/80"
          >
            {tCommon("resendCode")}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-ink-muted">
        {t("haveAccount")}{" "}
        <Link
          href={authPageHref("/sign-in", returnTo)}
          className="text-primary hover:text-primary/80"
        >
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
