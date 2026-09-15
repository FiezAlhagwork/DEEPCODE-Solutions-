"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useLocale } from "next-intl";

import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import type { ProjectCardProps } from "@/features/projects/types/Projects";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// The whole card is one link to the project's own page — there is no button
// inside it. A button nested in a link is invalid HTML and gives a pointer
// two targets for the same destination; the card also used to open a
// hardcoded external URL, which the API has no equivalent for.
export default function ProjectCard({ project }: ProjectCardProps) {
  const locale = useLocale() as Locale;

  return (
    <motion.article variants={cardVariants} className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-72 w-full overflow-hidden rounded-3xl border border-border/40 bg-[#1F1E20] transition-colors duration-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none md:h-80"
      >
        <Image
          src={project.coverImage}
          alt={project.name[locale]}
          fill
          // Cloudinary resizes to the width actually rendered, and the browser
          // fetches it directly. Next's own optimizer caps a remote fetch at a
          // hardcoded 7s, which a full-size photo on this link does not make.
          loader={cloudinaryLoader}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark at the bottom, clear at the top, so the text stays readable
            over any photo without dimming the whole image. The `via` stop sits
            at 40% rather than the default midpoint: a cover shot of a bright
            screenshot left the badge sitting on almost-white otherwise. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/95 via-black/65 via-40% to-transparent"
        />

        <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-3 p-5 text-start">
          <div className="flex min-w-0 flex-col gap-2">
            {/* A dark fill rather than the usual `bg-primary/15` tint: the
                badge sits on a photograph, and a translucent tint takes the
                colour of whatever is behind it. */}
            <span className="w-fit rounded-full border border-primary/40 bg-black/60 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
              {project.category.name[locale]}
            </span>
            <h3 className="truncate text-lg font-bold text-white md:text-xl">
              {project.name[locale]}
            </h3>
          </div>

          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-primary"
          >
            <ArrowLeft className="size-4 ltr:rotate-180" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
