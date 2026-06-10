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
          "relative flex h-full flex-col rounded-xl   p-8 transition-all duration-300 ease-out",
          featured ? cn(" bg-[#121115]/90", "drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]",) : "border border-white/10 bg-[#121115]/80 hover:scale-[1.02] hover:border-primary/30",
        )}
      >
        {featured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18)_0%,transparent_70%)]"
          />
        )}

        <div className="text-right">
          <h3 className="text-xl font-bold text-white md:text-2xl">{name}</h3>
          <p className="mt-2 text-lg text-white">
            <span className="font-semibold direction-ltr inline-block">
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
              className="flex items-start justify-start gap-2 text-[14px] leading-relaxed text-muted-foreground"
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
          className="mt-15"
        >
          اطلب الآن
        </Button>
      </div>
    </motion.li>
  );
}
