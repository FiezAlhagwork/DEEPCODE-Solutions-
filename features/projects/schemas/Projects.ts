import { z } from "zod";

import { SLUG_PATTERN } from "@/features/categories/schemas/Categories";

/**
 * Validation for the project form.
 *
 * A factory, not a constant, for two reasons: the error messages come from
 * `useTranslations`, and the cover-image rule depends on `isEdit` — a new
 * project must carry a cover file, while `PATCH` keeps the existing image when
 * the field is omitted.
 */

/**
 * `z.instanceof(File)` would throw where `File` is undefined. The form is a
 * client component but still prerenders on the server, so the guard stays.
 */
export const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

type CommonTranslator = (key: "required" | "invalidSlug") => string;
type FormTranslator = (key: "coverRequired") => string;

export const createProjectSchema = (
  t: FormTranslator,
  tCommon: CommonTranslator,
  isEdit: boolean,
) =>
  z.object({
    nameAr: z.string().min(1, tCommon("required")),
    nameEn: z.string().min(1, tCommon("required")),
    descriptionAr: z.string().min(1, tCommon("required")),
    descriptionEn: z.string().min(1, tCommon("required")),
    slug: z
      .string()
      .min(1, tCommon("required"))
      .regex(SLUG_PATTERN, tCommon("invalidSlug")),
    coverImage: z
      .custom<File | undefined>((value) => value === undefined || isFile(value))
      .refine((value) => isEdit || isFile(value), t("coverRequired")),
    categoryId: z.string().min(1, tCommon("required")),
    status: z.enum(["draft", "published"]),
    order: z.coerce.number().int().min(0),
    links: z.array(
      z.object({
        type: z.string().min(1, tCommon("required")),
        url: z.string().min(1, tCommon("required")),
      }),
    ),
  });

/**
 * `z.input`, not `z.infer`: `order` is `z.coerce.number()`, so what the form
 * holds and what the schema outputs are different types.
 */
export type ProjectFormValues = z.input<ReturnType<typeof createProjectSchema>>;
