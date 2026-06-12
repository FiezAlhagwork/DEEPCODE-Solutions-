"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PricingCardProps } from "@/types";
import { Button } from "./button";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function PricingCard({ plan }: PricingCardProps) {
  const { name, price, period, features, featured } = plan;

  return (
    <motion.li variants={cardVariants} className="list-none h-full">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl p-8 transition-all duration-300 ease-out",
          "flex h-full flex-col",
          featured
            ? "border border-primary/20 bg-[#121115]/90 shadow-[0_0_45px_rgba(168,85,247,0.18)] scale-[1.03] lg:scale-[1.05]"
            : "border border-white/10 bg-[#121115]/80 hover:scale-[1.02] hover:border-primary/30"
        )}
      >
        {featured && (
          <>
            {/* Purple Glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-xl
                bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0%,transparent_75%)]
              "
            />

            {/* Grid Background */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-xl
                opacity-[0.06]
                [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)]
                [background-size:40px_40px]
                [mask-image:radial-gradient(circle_at_center,black,transparent_95%)]
              "
            />
          </>
        )}

        <div className="relative z-10 flex h-full flex-col">
          <div className="text-right">
            <h3 className="text-xl font-bold text-white md:text-2xl">
              {name}
            </h3>

            <p className="mt-2 text-lg text-white">
              <span className="inline-block font-semibold direction-ltr">
                ${price}
              </span>

              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {period}
              </span>
            </p>
          </div>

          <hr className="my-6 border-white/10" />

          <ul className="flex flex-1 flex-col gap-3 text-left" role="list">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-[14px] leading-relaxed text-muted-foreground"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-white"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />

                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant={featured ? "default" : "outline"}
            className="mt-10"
          >
            اطلب الآن
          </Button>
        </div>
      </div>
    </motion.li>
  );
}