"use client";

import { Crosshair, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const pills = [
  { label: "بساطة", active: false },
  { label: "وثوقية", active: true },
  { label: "جودة", active: false },
];

export function Hero() {
  return (
    /* تم إزالة overflow-hidden وإضافة relative فقط لضمان تداخل الإضاءة مع القسم التالي */
    <section
      aria-label="Hero Introduction"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-24 bg-[#0D0D0E]"
    >
      {/* حاوية فرعية لحجب الـ Scroll الأفقي فقط دون قص الإضاءة العمودية الممتدة للأسفل */}
      <div className="absolute inset-0 overflow-x-hidden pointer-events-none z-0" />

      {/* تأثيرات الـ Blur الخلفية ممددة لتبدأ من أسفل الـ Hero وتتداخل مع الـ About */}
      {/* الجانب الأيسر (البنفسجي والفاتح) */}
      <div className="absolute left-0 bottom-[-15%] w-60 md:w-150 h-125 md:h-140 pointer-events-none opacity-50 mix-blend-screen select-none z-0">
        <div className="absolute inset-0 bg-[url('/Ellipse1.png')] bg-no-repeat bg-left bg-contain blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse2.png')] bg-no-repeat bg-left bg-contain blur-[80px]" />
      </div>

      {/* الجانب الأيمن (النيلي والداكن) */}
      <div className="absolute right-0 bottom-[-20%] w-60 md:w-150 h-125 md:h-140 pointer-events-none opacity-40 mix-blend-screen select-none z-0">
        <div className="absolute inset-0 bg-[url('/Ellipse5.png')] bg-no-repeat bg-right bg-contain blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse4.png')] bg-no-repeat bg-right bg-contain blur-[80px]" />
      </div>

      {/* الحاوية المتحركة الأساسية */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8"
      >
        {/* Step 1: Pills */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 flex-wrap justify-center"
        >
          {pills.map((pill) => (
            <span
              key={pill.label}
              className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                pill.active
                  ? "bg-primary/10 text-primary border border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pill.active && (
                <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 animate-pulse" />
              )}
              {pill.label}
            </span>
          ))}
        </motion.div>

        {/* Step 2: Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-[28px] md:text-5xl lg:text-5xl font-bold leading-tight text-balance text-white"
        >
          وجهتك الآمنة <span className="text-primary">لحضور رقمي</span> متكامل
        </motion.h1>

        {/* Step 3: Description */}
        <motion.p
          variants={itemVariants}
          className="text-md md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty"
        >
          نحول أفكارك إلى تجارب رقمية استثنائية تلبي احتياجات عملائك وتدعم نجاحك
          وتطورك في عالم الأعمال
        </motion.p>

        {/* Step 4: CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <Button size="lg" variant="default">
            <Rocket className="w-5 h-5 ml-2" /> احجز استشارتك المجانية
          </Button>
          <Button size="lg" variant="outline">
            <Crosshair className="w-5 h-5 ml-2" />
            اكتشف حلولنا التقنية
          </Button>
        </motion.div>

        {/* Step 5: Stats Card */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-md border border-primary/50 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group transition-colors duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 radial-glow opacity-30 pointer-events-none" />

          <dl className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-800/80">
            {/* Satisfied clients */}
            <div className="px-4 flex flex-col items-center">
              <dt className="text-gray-200 text-xs md:text-lg font-medium mb-1">
                عميل راضي
              </dt>
              <dd className="font-sans font-bold text-3xl md:text-4xl text-primary bg-clip-text bg-linear-to-br from-white to-purple-200 tracking-tight flex items-center direction-ltr">
                <span>+</span>
                <AnimatedCounter from={0} to={50} />
              </dd>
            </div>
            {/* Sustainable success */}
            <div className="px-4 flex flex-col items-center">
              <dt className="text-gray-200 text-xs md:text-lg font-medium mb-1">
                نجاح مستدام
              </dt>
              <dd className="font-sans font-bold text-3xl md:text-4xl text-primary bg-clip-text bg-linear-to-br from-white to-purple-200 tracking-tight flex items-center direction-ltr">
                <span>+</span>
                <AnimatedCounter from={0} to={30} />
              </dd>
            </div>
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
