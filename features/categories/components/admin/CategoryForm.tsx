"use client";

import { useEffect, useMemo, useRef } from "react";
import { notFound } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import Button from "@/components/kit/Button";
import Field from "@/components/kit/Field";
import {
  FormActions,
  FormLayout,
  FormSection,
} from "@/components/kit/FormLayout";
import { Panel } from "@/components/kit/Panel";
import TextInput from "@/components/kit/TextInput";
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/UseCategories";
import {
  createCategorySchema,
  type CategoryFormValues,
} from "@/features/categories/schemas/Categories";
import type { CategoryFormProps } from "@/features/categories/types/Categories";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/Api";

// A category is only a bilingual name plus a slug — the backend stores no
// description — so this form stays single-column, no settings aside.
export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const t = useTranslations("admin.categories.form");
  const tCommon = useTranslations("admin.common");
  const tMessages = useTranslations("admin.categories.messages");
  const router = useRouter();
  const isEdit = categoryId !== undefined;

  const categoryQuery = useCategory(categoryId ?? "");
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const category = categoryQuery.data;

  // Rebuilt only when the translator changes — otherwise `zodResolver` would
  // get a fresh identity on every render.
  const schema = useMemo(() => createCategorySchema(tCommon), [tCommon]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nameAr: "", nameEn: "", slug: "" },
  });

  // The record arrives after the first render, so the fields are filled in by
  // `reset` once it lands. Keyed by id rather than a boolean so the guard is
  // still correct if the same form is reused for a different record, and held
  // in a ref so a re-render never re-fills fields the user has since edited.
  const hydratedId = useRef<string | null>(null);

  useEffect(() => {
    if (!category || hydratedId.current === category._id) return;
    hydratedId.current = category._id;
    form.reset({
      nameAr: category.name.ar,
      nameEn: category.name.en,
      slug: category.slug,
    });
  }, [category, form]);

  async function onSubmit(values: CategoryFormValues) {
    // The mutation hooks own the toasts; catching here is what keeps
    // `mutateAsync`'s rejection from escaping react-hook-form as an unhandled
    // rejection, and keeps a failed save from navigating away.
    try {
      if (isEdit && categoryId) {
        await updateCategory.mutateAsync({ id: categoryId, values });
        return;
      }

      await createCategory.mutateAsync(values);
      router.push("/admin/categories");
    } catch (error) {
      // A taken slug is the one failure the user fixes by editing a specific
      // field, so it is marked on that field as well as announced — same split
      // between inline and toast the auth forms use.
      if (error instanceof ApiError && error.code === "DUPLICATE_KEY") {
        form.setError("slug", { message: tMessages("duplicateSlug") });
      }
    }
  }

  const errors = form.formState.errors;
  const isSaving = createCategory.isPending || updateCategory.isPending;

  if (
    isEdit &&
    categoryQuery.error instanceof ApiError &&
    categoryQuery.error.status === 404
  ) {
    notFound();
  }

  if (isEdit && categoryQuery.isPending && !category) {
    return (
      <Panel className="flex flex-col gap-3" aria-busy>
        <span className="sr-only">{tCommon("loading")}</span>
        <div className="h-10 animate-pulse rounded-lg bg-surface-3" />
        <div className="h-10 animate-pulse rounded-lg bg-surface-3" />
        <div className="h-10 animate-pulse rounded-lg bg-surface-3" />
      </Panel>
    );
  }

  if (isEdit && categoryQuery.isError) {
    const loadError =
      categoryQuery.error instanceof ApiError
        ? categoryQuery.error.message
        : undefined;

    return (
      <Panel>
        <p className="text-sm text-ink-muted">
          {tCommon("loadError", { message: loadError ?? tCommon("noResults") })}
        </p>
      </Panel>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormLayout className="max-w-3xl">
        <FormSection title={t("sectionContent")}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              htmlFor="nameAr"
              label={t("nameAr")}
              required
              error={errors.nameAr?.message}
            >
              <TextInput id="nameAr" dir="rtl" {...form.register("nameAr")} />
            </Field>

            <Field
              htmlFor="nameEn"
              label={t("nameEn")}
              required
              error={errors.nameEn?.message}
            >
              <TextInput id="nameEn" dir="ltr" {...form.register("nameEn")} />
            </Field>
          </div>

          <Field
            htmlFor="slug"
            label={t("slug")}
            required
            error={errors.slug?.message}
            className="md:w-1/2"
          >
            <TextInput id="slug" dir="ltr" {...form.register("slug")} />
          </Field>
        </FormSection>

        <FormActions>
          <Button variant="ghost" href="/admin/categories">
            {tCommon("cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={isSaving}>
            {isSaving ? tCommon("saving") : tCommon("save")}
          </Button>
        </FormActions>
      </FormLayout>
    </form>
  );
}
