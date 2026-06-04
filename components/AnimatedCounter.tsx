import { AnimatedCounterProps } from "@/types";
import { animate, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

// مكون عداد الأرقام عالي الأداء دون التسبب في Re-renders للمكون الرئيسي
function AnimatedCounter({ from, to }: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView) {
      // إطلاق حركة العداد بمجرد ظهور بطاقة الإحصائيات مع تأخير طفيف متناسق مع التتابع الداخلي
      const controls = animate(count, to, {
        duration: 2,
        delay: 0.5,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [count, to, isInView]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = String(latest);
      }
    });
  }, [rounded]);

  return <span ref={nodeRef}>{from}</span>;
}



export default AnimatedCounter