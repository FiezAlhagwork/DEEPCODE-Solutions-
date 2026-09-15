import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ProjectCover from "@/features/projects/components/ProjectCover";
import ProjectGallery from "@/features/projects/components/ProjectGallery";
import ProjectLinks from "@/features/projects/components/ProjectLinks";
import RelatedProjects from "@/features/projects/components/RelatedProjects";
import {
  getProjectById,
  getProjects,
} from "@/features/projects/services/Projects";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/i18n/metadata";
import { requireLocale } from "@/i18n/Locale";
import { ApiError } from "@/lib/Api";
import type { LocaleSlugRouteProps } from "@/types/Shared";

/**
 * `generateMetadata` and the page itself both need the record, and axios isn't
 * deduplicated the way `fetch` is — `cache()` makes the two calls share one
 * request per render. `null` rather than a throw so both callers can decide
 * what a missing project means for them.
 *
 * `GET /api/projects/:idOrSlug` is public and matches a slug as readily as an
 * id, so no token and no client-side hook are involved.
 */
const loadProject = cache(async (slug: string) => {
  try {
    return await getProjectById(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({
  params,
}: LocaleSlugRouteProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = requireLocale(rawLocale);
  const project = await loadProject(slug);

  if (!project) return {};

  return {
    title: project.name[locale],
    description: project.description[locale],
    alternates: localeAlternates(locale, `/projects/${slug}`),
  };
}

export default async function ProjectDetailPage({
  params,
}: LocaleSlugRouteProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = requireLocale(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations("projects.detail");
  const project = await loadProject(slug);

  // A draft, a deleted project, or a typed URL all land here identically —
  // the backend returns the same 404 for all three on purpose.
  if (!project) notFound();

  // Same category, minus this project. Four are requested so three remain
  // even when the current one is among them.
  const related = await getProjects({
    category: project.category._id,
    limit: 4,
  });
  const relatedProjects = related.data
    .filter((item) => item._id !== project._id)
    .slice(0, 3);

  return (
    // The same frame every section of the home page uses — `max-w-6xl` inside
    // `px-6 py-16 md:py-24`, and no background of its own, since `<body>`
    // already paints `#0D0D0E`. Moving between the projects list and a single
    // project should not change how wide the content sits.
    <div className="relative w-full overflow-x-clip px-6 py-16 md:py-24">
      <article className="relative z-10 mx-auto max-w-6xl">
        {/* `flex w-fit`, not `inline-flex`: two inline-level siblings sit on
            the same line whenever there is room for them, which put the back
            link and the category badge shoulder to shoulder. */}
        <Link
          href="/projects"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden />
          {t("back")}
        </Link>

        <span className="mb-4 flex w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          {project.category.name[locale]}
        </span>

        <h1 className="mb-8 text-3xl font-bold text-white md:text-5xl">
          {project.name[locale]}
        </h1>

        <ProjectCover src={project.coverImage} alt={project.name[locale]} />

        {/* User-authored copy, so newlines are the author's paragraphing. */}
        <p className="mt-10 text-base leading-relaxed whitespace-pre-line text-muted-foreground md:text-lg">
          {project.description[locale]}
        </p>

        <ProjectLinks links={project.links} />

        <ProjectGallery
          images={project.gallery}
          projectName={project.name[locale]}
        />

        <RelatedProjects projects={relatedProjects} />
      </article>
    </div>
  );
}
