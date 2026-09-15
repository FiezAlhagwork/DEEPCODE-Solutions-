"use client";

import Image from "next/image";

import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import type { ProjectCoverProps } from "@/features/projects/types/Projects";

// Its own client component purely so the detail page can stay a Server
// Component: `next/image`'s `loader` is a function, and a function prop can't
// cross the server/client boundary. The loader is what keeps Cloudinary
// images off Next's optimizer and its hardcoded 7-second fetch cap.
export default function ProjectCover({ src, alt }: ProjectCoverProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/40 bg-[#1F1E20]">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        loader={cloudinaryLoader}
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="object-cover"
      />
    </div>
  );
}
