"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import Field from "@/components/kit/Field";
import TextArea from "@/components/kit/TextArea";
import { DEFAULT_COUNTRY } from "../constants/Countries";
import { isPhoneRejection, useCreateRequest } from "../hooks/UseRequests";
import {
  createRequestSchema,
  NOTES_MAX_LENGTH,
  type RequestFormValues,
} from "../schemas/Requests";
import type { RequestFormProps } from "../types/Requests";
import { buildRequestPayload } from "../utils/Requests";
import PhoneField from "./PhoneField";
import RequestTypeField from "./RequestTypeField";

// Only rendered for a signed-in customer — `POST /api/requests` needs a
// session, and `lib/Api.ts` attaches its token on its own. The modal mounts it
// with a `key` per product, so opening a different server starts a clean form
// instead of carrying the last one's phone number and notes across.
export default function RequestForm({
  product,
  formId,
  onSubmitted,
}: RequestFormProps) {
  const t = useTranslations("requests.form");
  const createRequest = useCreateRequest();

  const schema = useMemo(() => createRequestSchema(t), [t]);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestType: "purchase",
      country: DEFAULT_COUNTRY,
      phoneNumber: "",
      notes: "",
    },
  });

  async function onSubmit(values: RequestFormValues) {
    // The hook owns the toast; catching keeps `mutateAsync`'s rejection from
    // escaping react-hook-form, and keeps a failed send from closing the modal.
    try {
      await createRequest.mutateAsync(buildRequestPayload(product, values));
      onSubmitted();
    } catch (error) {
      // A number with a plausible length that doesn't exist in the chosen
      // country only the server can catch — it is marked on the field the
      // customer has to change, not just announced.
      if (isPhoneRejection(error)) {
        form.setError("phoneNumber", { message: t("phoneInvalid") });
      }
    }
  }

  const errors = form.formState.errors;
  const pending = createRequest.isPending;

  return (
    // `noValidate`: the submit button lives in the modal's footer, outside
    // this element, and reaches it through `form={formId}` — the same setup as
    // `InviteUserModal`, where the browser's own checks otherwise fire first
    // and swallow the translated messages.
    <form
      id={formId}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => form.handleSubmit(onSubmit)(event)}
    >
      <Controller
        control={form.control}
        name="requestType"
        render={({ field }) => (
          <RequestTypeField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            disabled={pending}
          />
        )}
      />

      <Controller
        control={form.control}
        name="country"
        render={({ field }) => (
          <PhoneField
            countryId="requestCountry"
            numberId="requestPhone"
            country={field.value}
            onCountryChange={field.onChange}
            numberProps={form.register("phoneNumber")}
            error={errors.phoneNumber?.message}
            disabled={pending}
          />
        )}
      />

      <Field
        htmlFor="requestNotes"
        label={t("notes")}
        error={errors.notes?.message}
      >
        <TextArea
          id="requestNotes"
          maxLength={NOTES_MAX_LENGTH}
          placeholder={t("notesPlaceholder")}
          disabled={pending}
          {...form.register("notes")}
        />
      </Field>
    </form>
  );
}
