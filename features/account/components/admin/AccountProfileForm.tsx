"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import Button from "@/components/kit/Button";
import Field from "@/components/kit/Field";
import TextInput from "@/components/kit/TextInput";
import { useUpdateAccountProfile } from "../../hooks/UseAccount";
import {
  createAccountProfileSchema,
  type AccountProfileValues,
} from "../../schemas/Account";
import type { AccountProfileFormProps } from "../../types/Account";

// Receives its initial values as props and is mounted with a `key` by the
// panel, which is how it avoids copying `useUser()`'s data into state inside an
// effect — the pattern `ChangeRoleModal` established and that
// `react-hooks/set-state-in-effect` requires.
export default function AccountProfileForm({
  firstName,
  lastName,
}: AccountProfileFormProps) {
  const t = useTranslations("admin.account");
  const tCommon = useTranslations("admin.common");
  const updateProfile = useUpdateAccountProfile();

  const schema = useMemo(() => createAccountProfileSchema(tCommon), [tCommon]);

  const form = useForm<AccountProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName, lastName },
  });

  async function onSubmit(values: AccountProfileValues) {
    // The hook owns the toast; catching is what keeps `mutateAsync`'s rejection
    // from escaping react-hook-form as an unhandled rejection.
    try {
      await updateProfile.mutateAsync(values);
      // Re-seeds the form's baseline so the save button goes back to disabled
      // rather than staying lit over values that are already saved.
      form.reset(values);
    } catch {
      // Already reported.
    }
  }

  const errors = form.formState.errors;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => form.handleSubmit(onSubmit)(event)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          htmlFor="firstName"
          label={t("firstName")}
          required
          error={errors.firstName?.message}
        >
          <TextInput id="firstName" {...form.register("firstName")} />
        </Field>

        <Field
          htmlFor="lastName"
          label={t("lastName")}
          required
          error={errors.lastName?.message}
        >
          <TextInput id="lastName" {...form.register("lastName")} />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={updateProfile.isPending}
          disabled={!form.formState.isDirty}
        >
          {updateProfile.isPending ? tCommon("saving") : tCommon("save")}
        </Button>
      </div>
    </form>
  );
}
