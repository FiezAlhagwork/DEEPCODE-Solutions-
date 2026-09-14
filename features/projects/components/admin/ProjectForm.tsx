"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import Button from "@/components/admin/ui/Button";
import Field from "@/components/admin/ui/Field";
import FileDropzone from "@/components/admin/ui/FileDropzone";
import {
  FormActions,
  FormLayout,
  FormSection,
} from "@/components/admin/ui/FormLayout";
import IconButton from "@/components/admin/ui/IconButton";
import { Panel } from "@/components/admin/ui/Panel";
import SelectInput from "@/components/admin/ui/SelectInput";
import TextArea from "@/components/admin/ui/TextArea";
import TextInput from "@/components/admin/ui/TextInput";
import { ADMIN_SELECT_LIMIT } from "@/constants/Admin";
import { useCategories } from "@/features/categories/hooks/UseCategories";
import {
  useCreateProject,
  useDeleteProjectGalleryImage,
  useProject,
  useUpdateProject,
} from "@/features/projects/hooks/UseProjects";
import {
  createProjectSchema,
  type ProjectFormValues,
} from "@/features/projects/schemas/Projects";
import type {
  GalleryItem,
  ProjectFormProps,
  ProjectGalleryImage,
} from "@/features/projects/types/Projects";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/Api";
import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import { compressImage } from "@/lib/Images";

let galleryKey = 0;

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const t = useTranslations("admin.projects.form");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const isEdit = projectId !== undefined;

  const projectQuery = useProject(projectId ?? "");
  const categoriesQuery = useCategories({ limit: ADMIN_SELECT_LIMIT });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteGalleryImage = useDeleteProjectGalleryImage();

  const project = projectQuery.data;
  const categories = useMemo(() => {
    const list = categoriesQuery.data?.data ?? [];
    if (project && !list.some((item) => item._id === project.category._id)) {
      return [project.category, ...list];
    }
    return list;
  }, [categoriesQuery.data?.data, project]);

  const schema = useMemo(
    () => createProjectSchema(t, tCommon, isEdit),
    [t, tCommon, isEdit],
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: project?.name.ar ?? "",
      nameEn: project?.name.en ?? "",
      descriptionAr: project?.description.ar ?? "",
      descriptionEn: project?.description.en ?? "",
      slug: project?.slug ?? "",
      coverImage: undefined,
      categoryId: project?.category._id ?? "",
      status: project?.status ?? "draft",
      order: project?.order ?? 0,
      links: project?.links ?? [],
    },
  });

  const hydratedId = useRef<string | null>(null);

  useEffect(() => {
    if (!project || hydratedId.current === project._id) return;
    hydratedId.current = project._id;
    form.reset({
      nameAr: project.name.ar,
      nameEn: project.name.en,
      descriptionAr: project.description.ar,
      descriptionEn: project.description.en,
      slug: project.slug,
      coverImage: undefined,
      categoryId: project.category._id,
      status: project.status,
      order: project.order,
      links: project.links,
    });
  }, [project, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [preparingImages, setPreparingImages] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [pendingGalleryDelete, setPendingGalleryDelete] =
    useState<ProjectGalleryImage | null>(null);
  const liveUrls = useRef(new Set<string>());

  function createPreview(file: File) {
    const url = URL.createObjectURL(file);
    liveUrls.current.add(url);
    return url;
  }

  function releasePreview(url: string) {
    URL.revokeObjectURL(url);
    liveUrls.current.delete(url);
  }

  useEffect(() => {
    const outstanding = liveUrls.current;
    return () => {
      for (const url of outstanding) URL.revokeObjectURL(url);
      outstanding.clear();
    };
  }, []);

  // Both pickers shrink and re-encode to WebP before the file is ever held —
  // see `lib/Images.ts` for why. The dropzones are disabled while that runs so
  // a second pick can't land mid-encode, and so a slow phone photo isn't a
  // couple of seconds of nothing visibly happening.
  async function handleCoverPicked(files: File[]) {
    const [picked] = files;
    if (!picked) return;

    setPreparingImages(true);
    try {
      const file = await compressImage(picked);
      if (coverPreview) releasePreview(coverPreview);
      setCoverPreview(createPreview(file));
      form.setValue("coverImage", file, { shouldValidate: true });
    } finally {
      setPreparingImages(false);
    }
  }

  function clearCover() {
    if (coverPreview) releasePreview(coverPreview);
    setCoverPreview(null);
    form.setValue("coverImage", undefined, { shouldValidate: true });
  }

  async function handleGalleryPicked(files: File[]) {
    setPreparingImages(true);
    try {
      const compressed = await Promise.all(files.map((file) => compressImage(file)));
      const added = compressed.map((file) => ({
        id: `g${galleryKey++}`,
        file,
        url: createPreview(file),
      }));
      setGallery((current) => [...current, ...added]);
    } finally {
      setPreparingImages(false);
    }
  }

  function removeGalleryItem(id: string) {
    const target = gallery.find((item) => item.id === id);
    if (target) releasePreview(target.url);
    setGallery((current) => current.filter((item) => item.id !== id));
  }

  function moveGalleryItem(index: number, direction: -1 | 1) {
    setGallery((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function onSubmit(values: ProjectFormValues) {
    const galleryFiles = gallery.map((item) => item.file);

    // Both mutations already report their own failures through the toast in
    // their `onError`. Without catching here, the rejection `mutateAsync`
    // re-throws escapes react-hook-form as an unhandled rejection — and the
    // early `return` is what keeps a failed save from clearing the form or
    // navigating away as if it had worked.
    try {
      if (isEdit && projectId) {
        await updateProject.mutateAsync({ id: projectId, values, galleryFiles });
        for (const item of gallery) releasePreview(item.url);
        setGallery([]);
        clearCover();
        return;
      }

      await createProject.mutateAsync({ values, galleryFiles });
      router.push("/admin/projects");
    } catch {
      // Already surfaced by the mutation hook.
    }
  }

  const errors = form.formState.errors;
  const existingCover = project?.coverImage;
  const isSaving = createProject.isPending || updateProject.isPending;
  const loadError =
    projectQuery.error instanceof ApiError
      ? projectQuery.error.message
      : undefined;

  if (isEdit && projectQuery.isError) {
    if (
      projectQuery.error instanceof ApiError &&
      projectQuery.error.status === 404
    ) {
      notFound();
    }
  }

  if (isEdit && projectQuery.isPending && !project) {
    return (
      <Panel className="flex flex-col gap-3" aria-busy>
        <span className="sr-only">{tCommon("loading")}</span>
        <div className="h-10 animate-pulse rounded-lg bg-surface-3" />
        <div className="h-40 animate-pulse rounded-lg bg-surface-3" />
        <div className="h-40 animate-pulse rounded-lg bg-surface-3" />
      </Panel>
    );
  }

  if (isEdit && projectQuery.isError) {
    return (
      <Panel>
        <p className="text-sm text-ink-muted">
          {tCommon("loadError", { message: loadError ?? tCommon("noResults") })}
        </p>
      </Panel>
    );
  }

  return (
    // `handleSubmit(onSubmit)` is built inside the event handler, not during
    // render: `onSubmit` reads `liveUrls.current` (through `releasePreview`),
    // and handing a ref-reading function to a call that happens while
    // rendering is what `react-hooks/refs` rejects.
    <form onSubmit={(event) => form.handleSubmit(onSubmit)(event)}>
      <FormLayout
        aside={
          <>
            <FormSection title={t("sectionSettings")}>
              <Field htmlFor="status" label={t("status")}>
                <SelectInput id="status" {...form.register("status")}>
                  <option value="draft">{tCommon("statusDraft")}</option>
                  <option value="published">
                    {tCommon("statusPublished")}
                  </option>
                </SelectInput>
              </Field>

              <Field
                htmlFor="categoryId"
                label={t("category")}
                required
                error={errors.categoryId?.message}
              >
                <SelectInput id="categoryId" {...form.register("categoryId")}>
                  <option value="">{t("selectCategory")}</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name[locale]}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field
                htmlFor="order"
                label={t("order")}
                error={errors.order?.message}
              >
                <TextInput
                  id="order"
                  type="number"
                  min={0}
                  dir="ltr"
                  {...form.register("order")}
                />
              </Field>
            </FormSection>

            <FormSection title={t("coverImage")}>
              {coverPreview ? (
                <div className="flex flex-col gap-2">
                  <div className="relative aspect-video overflow-hidden rounded-lg border border-hairline bg-surface-1">
                    <Image
                      src={coverPreview}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCover}>
                    <X aria-hidden />
                    {tCommon("remove")}
                  </Button>
                </div>
              ) : (
                <>
                  {existingCover && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-ink-muted">
                        {t("currentImage")}
                      </span>
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-hairline bg-surface-1">
                        <Image
                          loader={cloudinaryLoader}
                          src={existingCover}
                          alt=""
                          fill
                          sizes="304px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <FileDropzone
                    id="coverImage"
                    label={
                      existingCover ? tCommon("replace") : t("dropzoneLabel")
                    }
                    hint={t("dropzoneHint")}
                    invalid={errors.coverImage !== undefined}
                    disabled={preparingImages}
                    onFilesAdded={handleCoverPicked}
                  />
                  {errors.coverImage && (
                    <p className="text-xs text-danger">
                      {errors.coverImage.message as string}
                    </p>
                  )}
                </>
              )}
            </FormSection>
          </>
        }
      >
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

            <Field
              htmlFor="descriptionAr"
              label={t("descriptionAr")}
              required
              error={errors.descriptionAr?.message}
            >
              <TextArea
                id="descriptionAr"
                dir="rtl"
                {...form.register("descriptionAr")}
              />
            </Field>

            <Field
              htmlFor="descriptionEn"
              label={t("descriptionEn")}
              required
              error={errors.descriptionEn?.message}
            >
              <TextArea
                id="descriptionEn"
                dir="ltr"
                {...form.register("descriptionEn")}
              />
            </Field>
          </div>

          <Field
            htmlFor="slug"
            label={t("slug")}
            hint={t("slugHint")}
            required
            error={errors.slug?.message}
          >
            <TextInput id="slug" dir="ltr" {...form.register("slug")} />
          </Field>
        </FormSection>

        <FormSection title={t("sectionMedia")} description={t("galleryHint")}>
          {project && project.gallery.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {project.gallery.map((item) => (
                  // The Cloudinary URL is unique per upload, so it stands in as
                  // a key for any older record stored without an `_id`.
                  <div
                    key={item._id ?? item.image}
                    className="relative h-20 w-28 overflow-hidden rounded-lg border border-hairline bg-surface-1"
                  >
                    <Image
                      loader={cloudinaryLoader}
                      src={item.image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                    {/* No `_id` means the delete endpoint has nothing to
                        address, so the button is withheld rather than offered
                        and then quietly doing nothing. */}
                    {item._id && (
                      <IconButton
                        size="sm"
                        variant="danger"
                        className="absolute inset-e-1 top-1 bg-black/70"
                        aria-label={tCommon("remove")}
                        onClick={() => setPendingGalleryDelete(item)}
                      >
                        <Trash2 aria-hidden />
                      </IconButton>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-faint">{t("galleryCurrentNote")}</p>
            </div>
          )}

          {gallery.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {gallery.map((item, index) => (
                <li key={item.id} className="flex flex-col gap-1.5">
                  <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-hairline bg-surface-1">
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <span className="absolute inset-s-1 top-1 rounded bg-black/70 px-1.5 text-[0.625rem] font-semibold text-ink tabular-nums">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-0.5">
                    <IconButton
                      size="sm"
                      aria-label={tCommon("moveUp")}
                      disabled={index === 0}
                      onClick={() => moveGalleryItem(index, -1)}
                    >
                      <ChevronLeft className="rtl:rotate-180" aria-hidden />
                    </IconButton>
                    <IconButton
                      size="sm"
                      aria-label={tCommon("moveDown")}
                      disabled={index === gallery.length - 1}
                      onClick={() => moveGalleryItem(index, 1)}
                    >
                      <ChevronRight className="rtl:rotate-180" aria-hidden />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="danger"
                      aria-label={tCommon("remove")}
                      onClick={() => removeGalleryItem(item.id)}
                    >
                      <Trash2 aria-hidden />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <FileDropzone
            id="gallery"
            multiple
            label={t("galleryDropzoneLabel")}
            hint={t("dropzoneHint")}
            disabled={preparingImages}
            onFilesAdded={handleGalleryPicked}
          />
        </FormSection>

        <FormSection title={t("links")}>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 sm:flex-row">
              <TextInput
                placeholder={t("linkType")}
                aria-label={t("linkType")}
                dir="ltr"
                className="sm:w-40"
                {...form.register(`links.${index}.type` as const)}
              />
              <TextInput
                placeholder={t("linkUrl")}
                aria-label={t("linkUrl")}
                dir="ltr"
                className="flex-1"
                {...form.register(`links.${index}.url` as const)}
              />
              <IconButton
                variant="danger"
                aria-label={tCommon("delete")}
                onClick={() => remove(index)}
              >
                <Trash2 aria-hidden />
              </IconButton>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => append({ type: "", url: "" })}
          >
            <Plus aria-hidden />
            {t("addLink")}
          </Button>
        </FormSection>

        <FormActions>
          <Button variant="ghost" href="/admin/projects">
            {tCommon("cancel")}
          </Button>
          {/* Also blocked while an image is still being re-encoded, so a save
              can't run off with a file that isn't ready yet. */}
          <Button
            type="submit"
            variant="primary"
            loading={isSaving || preparingImages}
          >
            {isSaving ? tCommon("saving") : tCommon("save")}
          </Button>
        </FormActions>
      </FormLayout>

      {projectId && (
        <DeleteConfirmDialog
          open={pendingGalleryDelete !== null}
          loading={deleteGalleryImage.isPending}
          onOpenChange={(open) => {
            if (!open && !deleteGalleryImage.isPending) {
              setPendingGalleryDelete(null);
            }
          }}
          onConfirm={() => {
            const imageId = pendingGalleryDelete?._id;
            if (!imageId) return;
            deleteGalleryImage.mutate(
              { projectId, imageId },
              { onSuccess: () => setPendingGalleryDelete(null) },
            );
          }}
        />
      )}
    </form>
  );
}
