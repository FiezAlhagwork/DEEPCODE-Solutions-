"use client";

import { FormEvent } from "react";

import { Button } from "./button";
import Field from "./Field";
import Input from "./Input";
import Textarea from "./Textarea";

export default function ContactForm() {

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="rounded-2xl   bg-[#1F1E20] p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <Field
            label="الاسم"
            htmlFor="name"
            iconName="User"
          >
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Mohamed"
              required
              autoComplete="fiez"
              dir="ltr"
              className="text-left placeholder:text-right"
            />
          </Field>
          <Field
            label="البريد الإلكتروني"
            htmlFor="email"
            iconName="Mail"
          >
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              autoComplete="email"
              dir="ltr"
              className="text-left placeholder:text-right"
            />
          </Field>

          <Field
            label="الشركة (اختياري)"
            htmlFor="company"
            iconName="Building2"
          >
            <Input
              id="company"
              name="company"
              placeholder="اسم الشركة"
              autoComplete="organization"
            />
          </Field>

          <Field
            label="الموضوع"
            htmlFor="subject"
            iconName="MessagesSquare"
            className=""
          >
            <Input
              id="subject"
              name="subject"
              placeholder="بناء موقع مثلاً"
              required
            />
          </Field>

        </div>

        <Field
          label="الرسالة"
          htmlFor="message"
          iconName="MessagesSquare"
        >
          <Textarea
            id="message"
            name="message"
            placeholder="أخبرنا عن فكرة مشروعك والجدول الزمني لتنفيذه"
            required
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full py-6 text-base"
        >
          إرسال الرسالة
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          عادة ما نستجيب خلال 24 ساعة. معلوماتك تبقى سرية.
        </p>
      </form>
    </div>
  );
}