import { ExternalLink, Github, Globe, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { ProjectLinksProps } from "@/features/projects/types/Projects";

/**
 * `link.type` is a free-form string on the backend, so this maps the ones we
 * actually use and leaves everything else with a neutral icon rather than
 * refusing to render a link whose type we happen not to recognise.
 */
const icons: Record<string, typeof Globe> = {
  preview: Globe,
  live: Globe,
  website: Globe,
  github: Github,
  store: ShoppingBag,
};

export default function ProjectLinks({ links }: ProjectLinksProps) {
  const t = useTranslations("projects.detail");

  if (links.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold text-white">{t("links")}</h2>

      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const Icon = icons[link.type.toLowerCase()] ?? ExternalLink;

          return (
            <Button key={link.url} asChild variant="outline">
              {/* A real external destination, so a plain `<a>` — the
                  locale-aware `Link` is for routes inside this site. */}
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <Icon className="size-4" aria-hidden />
                {/* The type is author-entered data, not UI chrome, so it is
                    shown as written; the label only falls back when empty. */}
                {link.type || t("visit")}
              </a>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
