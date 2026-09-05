"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";

export default function ContactForm() {
  const t = useTranslations("contact.form");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="rounded-2xl   bg-[#1F1E20] p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <Field label={t("name")} htmlFor="name" iconName="User">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t("namePlaceholder")}
              required
              autoComplete="name"
              dir="ltr"
              className="text-left placeholder:text-right"
            />
          </Field>

          <Field label={t("email")} htmlFor="email" iconName="Mail">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              autoComplete="email"
              dir="ltr"
              className="text-left placeholder:text-right"
            />
          </Field>

          <Field label={t("company")} htmlFor="company" iconName="Building2">
            <Input
              id="company"
              name="company"
              placeholder={t("companyPlaceholder")}
              autoComplete="organization"
            />
          </Field>

          <Field
            label={t("subject")}
            htmlFor="subject"
            iconName="MessagesSquare"
            className=""
          >
            <Input
              id="subject"
              name="subject"
              placeholder={t("subjectPlaceholder")}
              required
            />
          </Field>

        </div>

        <Field label={t("message")} htmlFor="message" iconName="MessagesSquare">
          <Textarea
            id="message"
            name="message"
            placeholder={t("messagePlaceholder")}
            required
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full py-6 text-base"
        >
          {t("submit")}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          {t("note")}
        </p>
      </form>
    </div>
  );
}
