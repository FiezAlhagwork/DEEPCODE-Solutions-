"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import type { ProjectGalleryProps } from "@/features/projects/types/Projects";

// A client component only because `next/image`'s `loader` is a function, and a
// function prop cannot cross the server/client boundary — see `ProjectCard`
// for why these images bypass Next's optimizer in the first place.
export default function ProjectGallery({
  images,
  projectName,
}: ProjectGalleryProps) {
  const t = useTranslations("projects.detail");

  if (images.length === 0) return null;

  // `order` is what the admin form arranges; the array's own order is not
  // guaranteed to match it after an edit.
  const ordered = [...images].sort((a, b) => a.order - b.order);

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold text-white">{t("gallery")}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ordered.map((item, index) => (
          <div
            // Falls back to the URL: a gallery item can arrive without an
            // `_id`, and Cloudinary URLs are unique per upload.
            key={item._id ?? item.image}
            className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/40 bg-[#1F1E20]"
          >
            <Image
              src={item.image}
              alt={`${projectName} — ${index + 1}`}
              fill
              loader={cloudinaryLoader}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
