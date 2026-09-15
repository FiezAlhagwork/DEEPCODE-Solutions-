import { useTranslations } from "next-intl";

import type { RelatedProjectsProps } from "@/features/projects/types/Projects";
import ProjectList from "./ProjectList";

// Rendered from the detail page, which already fetched these on the server —
// this only adds the heading, so it stays a server component. `ProjectList`
// is a client component underneath, which is fine: the projects it receives
// are plain serialisable data.
export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  const t = useTranslations("projects.detail");

  if (projects.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/40 pt-12">
      <h2 className="mb-6 text-2xl font-semibold text-white">{t("related")}</h2>
      <ProjectList projects={projects} />
    </section>
  );
}
