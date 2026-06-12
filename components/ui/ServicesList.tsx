"use client";

import { motion } from "motion/react";
import ServicesCard from "./ServicesCard";
import { ServiceListProps } from "@/types";

const listVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ServicesList({ services }: ServiceListProps) {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 "
    >
      {services.map((service) => (
        <ServicesCard key={service.title} service={service} />
      ))}
    </motion.div>
  );
}
