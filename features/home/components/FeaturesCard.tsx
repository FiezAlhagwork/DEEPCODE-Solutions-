"use client";

import { FeatureCardProps } from "@/features/home/types/Home";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import * as LucideIcons from "lucide-react";

// أنميشن الظهور التدريجي من الأسفل لكل كارت بشكل مستقل
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const, // تأثير فيزيائي سلس جداً متوافق مع باقي الواجهة
    },
  },
};

export default function FeaturesCard({ feature }: FeatureCardProps) {
  const t = useTranslations("features.items");
  const { key, iconName } = feature;

  const IconComponent = LucideIcons[iconName] as LucideIcons.LucideIcon;

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col items-start text-start p-8  rounded-3xl bg-[#1F1E20] border border-border/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-primary hover:bg-[#1F1E20]/30 group"
    >
      {/* أيقونة الميزة بلون الـ Primary البنفسجي مع تأثير توهج خفيف عند الـ Hover */}
      <div className="mb-6 text-primary  ">
        {IconComponent && <IconComponent size={35} strokeWidth={1.5} />}
      </div>

      {/* عنوان الكارت */}
      <h3 className="text-xl font-bold text-foreground mb-2">
        {t(`${key}.title`)}
      </h3>

      {/* النص الوصفي للكارت بلون الـ Muted Foreground */}
      <p className="text-sm font-light leading-relaxed text-muted-foreground text-pretty">
        {t(`${key}.description`)}
      </p>
    </motion.div>
  );
}
