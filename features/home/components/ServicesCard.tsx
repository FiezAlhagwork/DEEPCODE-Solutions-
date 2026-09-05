"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ServiceCardProps } from "@/features/home/types/Home";

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

export default function ServicesCard({ service }: ServiceCardProps) {
  const t = useTranslations("services.items");
  const { key, icon: Icon } = service;

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-border/40 bg-[#1F1E20] p-8 text-start backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-[#1F1E20]/30"
    >
      <div className="mb-6 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon size={35} strokeWidth={1.5} aria-hidden />
      </div>

      <h3 className="mb-2 text-xl font-bold text-foreground">{t(`${key}.title`)}</h3>

      <p className="text-sm font-light leading-relaxed text-muted-foreground text-pretty">
        {t(`${key}.description`)}
      </p>
    </motion.article>
  );
}
