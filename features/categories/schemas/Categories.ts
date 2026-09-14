import { z } from "zod";

/**
 * Validation for the category form.
 *
 * Exported as a factory rather than a plain constant because every error
 * message comes from `useTranslations`, which only exists inside a component.
 * The caller builds it once with `useMemo` so `zodResolver` keeps a stable
 * identity across renders.
 */

/** Lowercase kebab-case, matching what the backend accepts for a slug. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Translator = (key: "required" | "invalidSlug") => string;

export const createCategorySchema = (tCommon: Translator) =>
  z.object({
    nameAr: z.string().min(1, tCommon("required")),
    nameEn: z.string().min(1, tCommon("required")),
    slug: z
      .string()
      .min(1, tCommon("required"))
      .regex(SLUG_PATTERN, tCommon("invalidSlug")),
  });

export type CategoryFormValues = z.infer<
  ReturnType<typeof createCategorySchema>
>;
