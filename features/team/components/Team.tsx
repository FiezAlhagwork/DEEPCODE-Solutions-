"use client";

import { motion } from "motion/react";
import TeamList from "./TeamList";
import { useTranslations } from "next-intl";
import { teamMembers } from "@/features/team/constants/Team";
import { Link } from "@/i18n/navigation";

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

const Team = () => {
  const t = useTranslations("team");

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative w-full px-6 py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-s-0 top-[10%] z-0 h-125 w-60 opacity-40 mix-blend-screen select-none md:h-140 md:w-150"
      >
        <div className="absolute inset-0 bg-[url('/Ellipse1.webp')] bg-contain rtl:bg-right ltr:bg-left bg-no-repeat blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse2.webp')] bg-contain rtl:bg-right ltr:bg-left bg-no-repeat blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl ">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.span
            variants={headerItemVariants}
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary"
          >
            {t("badge")}
          </motion.span>

          <motion.h2
            id="team-heading"
            variants={headerItemVariants}
            className="text-3xl font-medium text-white md:text-4xl"
          >
            {t.rich("title", {
              hl: (chunks) => (
                <span className="text-primary bg-clip-text ">{chunks}</span>
              ),
            })}
          </motion.h2>

          <motion.p
            variants={headerItemVariants}
            className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        <TeamList members={teamMembers} />

        {/* دعوة للانضمام إلى الفريق */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center"
        >
          <motion.h3
            variants={headerItemVariants}
            className="text-2xl font-medium text-white md:text-3xl"
          >
            {t.rich("joinTitle", {
              hl: (chunks) => <span className="text-primary">{chunks}</span>,
            })}
          </motion.h3>

          <motion.p
            variants={headerItemVariants}
            className="text-sm text-muted-foreground md:text-base"
          >
            {t("joinText")}{" "}
            <Link
              href="/#contact"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              {t("joinCta")}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
