"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { contactInfoItems } from "@/constants/Site";
import ContactInfoItem from "./ContactInfoItem";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ContactInfo() {
  const t = useTranslations("contact");

  return (
    <div className="flex flex-col gap-8 text-start">
      <h2 className="text-2xl font-semibold text-primary md:text-3xl">
        {t("infoTitle")}
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col gap-13"
      >
        {contactInfoItems.map((item) => (
          <motion.div key={item.key} variants={itemVariants}>
            <ContactInfoItem
              iconName={item.iconName}
              title={t(`info.${item.key}.title`)}
              detail={t(`info.${item.key}.detail`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
