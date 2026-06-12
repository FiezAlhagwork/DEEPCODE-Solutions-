"use client";

import { motion } from "motion/react";
import { contactInfoItems } from "@/constant";
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
  return (
    <div className="flex flex-col gap-8 text-right">
      <h2 className="text-2xl font-semibold text-primary md:text-3xl">
        معلومات الاتصال
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col gap-13"
      >
        {contactInfoItems.map((item) => (
          <motion.div key={item.title} variants={itemVariants}>
            <ContactInfoItem item={item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
