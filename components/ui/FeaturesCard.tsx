"use client";

import { FeatureCardProps } from "@/types";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";

// تعريف الـ Types الخاصة ببيانات الكارت لضمان TypeScript Type Safety

// أنميشن الظهور التدريجي من الأسفل لكل كارت بشكل مستقل
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1], // تأثير فيزيائي سلس جداً متوافق مع باقي الواجهة
    },
  },
};

export default function FeaturesCard({ feature }: FeatureCardProps) {
  const { title, description, iconName } = feature;

  const IconComponent = LucideIcons[iconName] as LucideIcons.LucideIcon;

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col items-start text-right p-8  rounded-3xl bg-[#1F1E20] border border-border/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-primary hover:bg-[#1F1E20]/30 group"
    >
      {/* أيقونة الميزة بلون الـ Primary البنفسجي مع تأثير توهج خفيف عند الـ Hover */}
      <div className="mb-6 text-primary  ">
        {IconComponent && <IconComponent size={35} strokeWidth={1.5} />}
      </div>

      {/* عنوان الكارت */}
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

      {/* النص الوصفي للكارت بلون الـ Muted Foreground */}
      <p className="text-sm font-light leading-relaxed text-muted-foreground text-pretty">
        {description}
      </p>
    </motion.div>
  );
}
