"use client";

import {  motion } from "motion/react";
import FeaturesCard from "./FeaturesCard";
import {  FeatureListProps } from "@/types";


// الحاوية الأساسية المسؤولة عن تنسيق توقيت ظهور الأبناء (Staggering)
const listVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // فارق زمني 150ms بين ظهور كل كارت والآخر
    },
  },
};

export default function FeaturesList({features}:FeatureListProps) {
  return (
    <div className="w-full py-5 bg-transparent" dir="rtl">
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // يبدأ عند ظهور 20% من المكون بالشاشة ويحدث لمرة واحدة لتوفير أداء الـ GPU
        className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((feature) => (
          <FeaturesCard key={feature.title} feature={feature} />
        ))}
      </motion.div>
    </div>
  );
}
