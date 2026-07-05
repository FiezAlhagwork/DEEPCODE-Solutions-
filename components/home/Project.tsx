"use client";

import { motion } from "motion/react";
import ProjectList from "../ui/projectList";
import { projects } from "@/constant/projectData";

const headerContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.12,
    },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

 const Project = () =>  {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative w-full px-6 py-16 md:py-24"
      dir="rtl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 bottom-[-10%] z-0 h-125 w-60 opacity-40 mix-blend-screen select-none md:h-140 md:w-150"
      >
        <div className="absolute inset-0 bg-[url('/Ellipse1.png')] bg-contain bg-left bg-no-repeat blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse2.png')] bg-contain bg-left bg-no-repeat blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-12 flex flex-col items-center gap-4 text-center"
        >
          <motion.span
            variants={headerItemVariants}
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary"
          >
            أعمالنا
          </motion.span>

          <motion.h2
            id="projects-heading"
            variants={headerItemVariants}
            className="text-3xl font-medium text-white md:text-4xl"
          >
            مشاريع رقمية متميزة
          </motion.h2>

          <motion.p
            variants={headerItemVariants}
            className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            استكشف مجموعة من أحدث المشاريع التي أنجزناها للعملاء، تجمع بين
            الإبداع والتقنية والأداء العالي
          </motion.p>
        </motion.div>

        <ProjectList projects={projects} />
      </div>
    </section>
  );
} 


export default Project