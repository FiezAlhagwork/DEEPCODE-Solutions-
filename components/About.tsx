"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { motion } from "framer-motion";


// أنميشن خاص بحاوية النصوص (تظهر من اليمين إلى اليسار بسلاسة)
const textContainerVariants = {
  hidden: { opacity: 0, x: 50 }, // يبدأ مزاحاً جهة اليمين قليلاً ومعتم
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // تأثير فيزيائي ناعم جداً
      staggerChildren: 0.12, // تتابع ظهور العناصر الداخلية (العنوان، الوصف، الزر)
    },
  },
};

// أنميشن فرعي لعناصر النصوص الداخلية
const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// أنميشن خاص بالعمود الذي يحتوي على الصورة (تأثير التكبير والظهور التدريجي الفخم)
const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2, // تأخير بسيط لتبدأ الصورة بالظهور بعد النصوص
    },
  },
};

const About = () => {
  return (
    <section
      aria-label="من نحن"
      className="relative w-full px-6 py-10 md:py-20 bg-transparent"
      dir="rtl"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* العمود: حاوية الصورة والخطوط التقاطعية */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // once: true تضمن أن الأنميشن يحدث مرة واحدة فقط عند التمرير أول مرة
          className="relative flex min-h-80 items-center justify-center order-2 lg:order-1"
        >
          {/* الخطوط التقاطعية في الخلفية */}
          <div
            aria-hidden="true"
            className="absolute h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute h-full w-px bg-linear-to-b from-transparent via-primary/40 to-transparent"
          />

          {/* الصورة مع تأثير الطفو الافتراضي */}
          <div className="animate-float relative p-6">
            <Image
              src="/mingcute_safety-certificate-line.png"
              alt="درع الأمان والموثوقية"
              width={280}
              height={280}
              className="h-auto w-55 md:w-70 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              priority
            />
          </div>
        </motion.div>

        {/* العمود: حاوية النصوص والمعلومات */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // amount: 0.3 يبدأ الأنميشن عند ظهور 30% من القسم في الشاشة
          className="flex flex-col items-center text-center lg:items-start lg:text-right gap-6 order-1 lg:order-2"
        >
          {/* الشارة العلوية (Badge) */}
          <motion.span
            variants={textItemVariants}
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary"
          >
            من نحن؟
          </motion.span>

          {/* العنوان الفرعي */}
          <motion.h2
            variants={textItemVariants}
            className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-balance"
          >
            نبتكر اليوم حلولاً لمشاكل الغد
          </motion.h2>

          {/* اسم الهوية البرمجية */}
          <motion.div
            variants={textItemVariants}
            className="flex items-center gap-3 py-1"
          >
            <span className="text-3xl font-bold tracking-wide text-white md:text-3xl">
              <span className="text-primary">DEEP CODE</span> Solutions
            </span>
          </motion.div>

          {/* النص الوصفي */}
          <motion.p
            variants={textItemVariants}
            className="max-w-xl text-base font-light leading-relaxed text-muted-foreground text-pretty"
          >
            نحن أكثر من مجرد شركة برمجيات - نحن نبتكر - نحل المشاكل - نبني حلول
            رقمية تقود للنجاح
          </motion.p>

          {/* زر اتخاذ الإجراء */}
          <motion.div variants={textItemVariants}>
            <Button size="lg" variant="default">
              ابدأ مشروعك الآن
            </Button>
          </motion.div>
        </motion.div>
   
      </div>
    </section>
  );
};

export default About;
