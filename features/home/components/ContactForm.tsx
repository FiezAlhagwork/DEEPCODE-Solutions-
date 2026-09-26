"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DEFAULT_COUNTRY } from "@/constants/Countries";
import ContactPhoneField from "@/features/contact/components/ContactPhoneField";
import ContactSuccess from "@/features/contact/components/ContactSuccess";
import {
  isContactPhoneRejection,
  useCreateContactMessage,
} from "@/features/contact/hooks/UseContact";
import {
  createContactSchema,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  type ContactFormValues,
} from "@/features/contact/schemas/Contact";
import { buildContactPayload } from "@/features/contact/utils/Contact";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";

const EMPTY: ContactFormValues = {
  name: "",
  email: "",
  country: DEFAULT_COUNTRY,
  phoneNumber: "",
  message: "",
  website: "",
};

// The home page's contact form. It stays in `features/home` as part of the
// section it sits in, and sends through `features/contact` — the same split as
// `ProductCard` opening the requests feature's modal.
//
// `noValidate` for the reason `InviteUserModal` gives: the browser's own check
// on `type="email"` would otherwise block the submit with an untranslated
// bubble before the translated message under the field could show.
export default function ContactForm() {
  const t = useTranslations("contact.form");
  const send = useCreateContactMessage();
  const [sent, setSent] = useState(false);

  const schema = useMemo(() => createContactSchema(t), [t]);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });
  const { errors } = form.formState;
  const busy = send.isPending;

  async function onSubmit(values: ContactFormValues) {
    // The hook owns the error toast; catching keeps `mutateAsync`'s rejection
    // from escaping react-hook-form.
    try {
      await send.mutateAsync(buildContactPayload(values));
      form.reset(EMPTY);
      setSent(true);
    } catch (error) {
      if (isContactPhoneRejection(error)) {
        form.setError("phoneNumber", { message: t("phoneInvalid") });
      }
    }
  }

  const describedBy = (field: keyof ContactFormValues) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <div className="rounded-2xl bg-[#1F1E20] p-6 md:p-8">
      {sent ? (
        <ContactSuccess onAgain={() => setSent(false)} />
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="relative flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label={t("name")}
              htmlFor="name"
              iconName="User"
              error={errors.name?.message}
            >
              <Input
                id="name"
                type="text"
                placeholder={t("namePlaceholder")}
                autoComplete="name"
                maxLength={NAME_MAX_LENGTH}
                disabled={busy}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy("name")}
                {...form.register("name")}
              />
            </Field>

            <Field
              label={t("email")}
              htmlFor="email"
              iconName="Mail"
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                dir="ltr"
                className="text-left placeholder:text-right"
                disabled={busy}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy("email")}
                {...form.register("email")}
              />
            </Field>
          </div>

          <Controller
            control={form.control}
            name="country"
            render={({ field }) => (
              <ContactPhoneField
                countryId="contact-country"
                numberId="phoneNumber"
                country={field.value}
                onCountryChange={field.onChange}
                numberProps={form.register("phoneNumber")}
                error={errors.phoneNumber?.message}
                disabled={busy}
              />
            )}
          />

          <Field
            label={t("message")}
            htmlFor="message"
            iconName="MessagesSquare"
            error={errors.message?.message}
          >
            <Textarea
              id="message"
              placeholder={t("messagePlaceholder")}
              maxLength={MESSAGE_MAX_LENGTH}
              disabled={busy}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy("message")}
              {...form.register("message")}
            />
          </Field>

          {/* The honeypot. Parked off-screen rather than `display:none`, which
              some bots skip; hidden from assistive tech and the tab order, so
              no person ever fills it. A value here means a bot, and the
              backend quietly drops the message. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-s-[10000px] top-0 h-px w-px overflow-hidden opacity-0"
          >
            <label htmlFor="website">{t("website")}</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="mt-1 w-full py-6 text-base"
          >
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {busy ? t("sending") : t("submit")}
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {t("note")}
          </p>
        </form>
      )}
    </div>
  );
}
