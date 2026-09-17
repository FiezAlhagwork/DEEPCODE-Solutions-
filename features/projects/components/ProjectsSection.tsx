"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useProjects } from "@/features/projects/hooks/UseProjects";
import { Link } from "@/i18n/navigation";
import ProjectList from "./ProjectList";

/** The home page is a teaser, not the archive — the rest live at `/projects`. */
const HOME_PROJECT_LIMIT = 6;

const headerContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.12,
    },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

 const ProjectsSection = () => {
  const t = useTranslations("projects");
  // The backend already sorts by `order` then newest, so "the first six" is
  // whatever was arranged in the admin panel — no client-side sorting here.
  //
  // `status` is load-bearing, not decoration: `lib/Api.ts` attaches the Clerk
  // token to every browser request, including this one, and the backend shows
  // drafts to any request carrying an admin session. Without it a signed-in
  // admin browsing the public site sees a different site than a visitor does —
  // including draft cards whose detail pages answer 404.
  const projectsQuery = useProjects({
    page: 1,
    limit: HOME_PROJECT_LIMIT,
    status: "published",
  });

  const projects = projectsQuery.data?.data ?? [];
  const total = projectsQuery.data?.pagination.total ?? 0;
  const isLoading = projectsQuery.isPending && !projectsQuery.data;

  // A heading floating above an empty grid reads as a broken page, so the
  // whole section stands down when there is genuinely nothing to show.
  if (!isLoading && !projectsQuery.isError && projects.length === 0) return null;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative w-full px-6 py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-e-0 bottom-[-10%] z-0 h-125 w-60 opacity-40 mix-blend-screen select-none md:h-140 md:w-150"
      >
        <div className="absolute inset-0 bg-[url('/Ellipse1.webp')] bg-contain rtl:bg-left ltr:bg-right bg-no-repeat blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse2.webp')] bg-contain rtl:bg-left ltr:bg-right bg-no-repeat blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-12 flex flex-col items-center gap-4 text-center"
        >
          <motion.span
            variants={headerItemVariants}
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary"
          >
            {t("badge")}
          </motion.span>

          <motion.h2
            id="projects-heading"
            variants={headerItemVariants}
            className="text-3xl font-medium text-white md:text-4xl"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            variants={headerItemVariants}
            className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-busy
          >
            <span className="sr-only">{t("loading")}</span>
            {Array.from({ length: HOME_PROJECT_LIMIT }, (_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-3xl bg-white/5 md:h-80"
              />
            ))}
          </div>
        ) : projectsQuery.isError ? (
          <p className="text-center text-sm text-muted-foreground">
            {t("loadError")}
          </p>
        ) : (
          <>
            <ProjectList projects={projects} />

            {total > HOME_PROJECT_LIMIT && (
              // Deliberately identical to the VPS section's button: both take
              // you from a trimmed section on the home page to the full
              // listing, so they should not look like two different kinds of
              // action.
              <div className="flex items-center justify-center">
                <Button
                  asChild
                  className="relative z-10 mt-6 text-md"
                  variant="default"
                >
                  <Link href="/projects">
                    {t("viewAll")}
                    <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


export default ProjectsSection