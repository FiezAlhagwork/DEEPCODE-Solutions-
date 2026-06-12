"use client";

import { motion } from "motion/react";
import ContactForm from "./ui/ContactForm";
import ContactInfo from "./ui/ContactInfo";

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

const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const infoVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full  px-6 py-16 md:py-24"
      dir="rtl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[-15%] z-0 h-125 w-60 opacity-40 mix-blend-screen select-none md:h-140 md:w-150"
      >
        <div className="absolute inset-0 bg-[url('/Ellipse5.png')] bg-contain bg-right bg-no-repeat blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse4.png')] bg-contain bg-right bg-no-repeat blur-[80px]" />
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
            تواصل معنا
          </motion.span>

          <motion.h2
            id="contact-heading"
            variants={headerItemVariants}
            className="text-3xl font-medium text-white md:text-4xl"
          >
            دعنا نساعدك بنجاح مشروعك
          </motion.h2>

          <motion.p
            variants={headerItemVariants}
            className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            نحن بجانبك لنخطط معاً لتحويل أفكارك إلى منتجات رقمية ناجحة
          </motion.p>
        </motion.div>

        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <motion.div variants={infoVariants}>
            <ContactInfo />
          </motion.div>
          <motion.div variants={formVariants}>
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
