"use client";

import { motion } from "motion/react";
import TeamCard from "./TeamCard";
import type { TeamListProps } from "@/features/team/types/Team";

const listVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function TeamList({ members }: TeamListProps) {
  const isOddCount = members.length % 2 !== 0;

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-x-6 gap-y-20 pt-20 md:grid-cols-2"
    >
      {members.map((member, index) => (
        <TeamCard
          key={member.key}
          member={member}
          isOrphan={isOddCount && index === members.length - 1}
        />
      ))}
    </motion.div>
  );
}
