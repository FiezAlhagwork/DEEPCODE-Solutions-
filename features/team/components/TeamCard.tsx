"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/Utils";
import type { TeamCardProps } from "@/features/team/types/Team";

// أنميشن ظهور الكارت من الأسفل بنفس إحساس باقي أقسام الموقع
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

export default function TeamCard({ member, isOrphan = false }: TeamCardProps) {
  const { name, role, image, contactHref } = member;

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        "group relative flex min-h-45 items-center rounded-3xl border border-border/40 bg-[#1F1E20] backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-[#1F1E20]/30 md:min-h-60",
        isOrphan && "md:col-span-2 md:mx-auto md:w-1/2",
      )}
    >
      {/* صورة العضو على يمين الكارت - تتجاوز الحافة العلوية كما في التصميم */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[128%] w-1/2 select-none md:w-[45%]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="object-contain object-bottom "
        />
      </div>
      {/* النصوص على يسار الكارت */}
      <div className="relative z-10 mr-auto flex w-3/5 flex-col items-end gap-3 p-6 text-left">
        <p className="text-xs font-light leading-relaxed text-muted-foreground md:text-sm">
          {role}
        </p>

        <h3 className="text-primary bg-clip-text text-xl font-bold  md:text-2xl">
          {name}
        </h3>

        <a
          href={contactHref}
          className="mt-1 rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
        >
          تواصل الان
        </a>
      </div>
    </motion.article>
  );
}
