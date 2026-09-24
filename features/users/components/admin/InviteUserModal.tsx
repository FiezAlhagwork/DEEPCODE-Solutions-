"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import Button from "@/components/kit/Button";
import Field from "@/components/kit/Field";
import Modal from "@/components/kit/Modal";
import SelectInput from "@/components/kit/SelectInput";
import TextInput from "@/components/kit/TextInput";
import { useInviteUser } from "@/features/users/hooks/UseUsers";
import {
  createInviteUserSchema,
  type InviteUserFormValues,
} from "@/features/users/schemas/Users";
import type { InviteUserModalProps } from "@/features/users/types/Users";

const FORM_ID = "inviteUserForm";

// `POST /api/users` is `super_admin`-only and sends a Clerk invitation, so the
// role list here deliberately omits `user` — a plain user arrives through
// self-signup, never through an invite.
export default function InviteUserModal({
  open,
  onOpenChange,
}: InviteUserModalProps) {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");
  const inviteUser = useInviteUser();

  // Rebuilt only when the translator changes, so `zodResolver` keeps a stable
  // identity across renders.
  const schema = useMemo(() => createInviteUserSchema(tCommon), [tCommon]);

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "admin" },
  });

  function close() {
    if (inviteUser.isPending) return;
    onOpenChange(false);
    form.reset();
  }

  async function onSubmit(values: InviteUserFormValues) {
    // The hook owns the toast; catching is what keeps `mutateAsync`'s
    // rejection from escaping react-hook-form as an unhandled rejection, and
    // what stops a refused invitation from closing the dialog as if it worked.
    try {
      await inviteUser.mutateAsync(values);
      onOpenChange(false);
      form.reset();
    } catch {
      /* Already surfaced by the mutation hook. */
    }
  }

  const errors = form.formState.errors;

  return (
    <Modal
      open={open}
      onClose={close}
      closeLabel={tCommon("cancel")}
      title={t("inviteTitle")}
      description={t("inviteDescription")}
      footer={
        <>
          <Button
            variant="ghost"
            disabled={inviteUser.isPending}
            onClick={close}
          >
            {tCommon("cancel")}
          </Button>
          {/* The footer sits outside `children`, so the submit button reaches
              the form through the `form` attribute — that keeps Enter-to-submit
              working instead of making the button the only way in. */}
          <Button
            type="submit"
            form={FORM_ID}
            variant="primary"
            loading={inviteUser.isPending}
          >
            {t("inviteSubmit")}
          </Button>
        </>
      }
    >
      {/* `noValidate` hands validation to zod. Without it the browser's own
          constraint check on `type="email"` fires first and blocks the submit
          with an untranslated native bubble, so the translated message under
          the field would never get a chance to render. */}
      <form
        id={FORM_ID}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Field
          htmlFor="inviteEmail"
          label={t("inviteEmail")}
          required
          error={errors.email?.message}
        >
          <TextInput
            id="inviteEmail"
            type="email"
            dir="ltr"
            autoComplete="off"
            placeholder="name@example.com"
            disabled={inviteUser.isPending}
            {...form.register("email")}
          />
        </Field>

        <Field htmlFor="inviteRole" label={t("inviteRole")}>
          <SelectInput
            id="inviteRole"
            disabled={inviteUser.isPending}
            {...form.register("role")}
          >
            <option value="admin">{tCommon("roleAdmin")}</option>
            <option value="super_admin">{tCommon("roleSuperAdmin")}</option>
          </SelectInput>
        </Field>
      </form>
    </Modal>
  );
}
