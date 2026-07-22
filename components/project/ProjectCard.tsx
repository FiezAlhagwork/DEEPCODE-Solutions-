"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import type { Project } from "@/types";

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

export default function ProjectCard({ project }: { project: Project }) {
  const { title, year, tags, image, link, color } = project;

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-[#1F1E20] backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-[#1F1E20]/30"
    >
      {/* صورة المشروع */}
      <div className={`relative h-64 w-full overflow-hidden ${color}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* محتوى الكارت */}
      <div className="flex flex-1 flex-col p-6 text-right">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">{year}</span>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>

        {/* التاجات */}
        <div className="mb-6 flex flex-wrap justify-end gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        
          <Button
            asChild
            variant="default"
            className="w-full self-end mt-auto"
          >
            <a href={link} target="_blank" rel="noopener noreferrer">
              شاهد المشروع
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
      </div>
    </motion.article>
  );
}