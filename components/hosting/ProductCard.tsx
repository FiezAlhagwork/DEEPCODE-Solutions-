"use client";

import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Gauge, ServerCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductCardProps } from "@/types/hosting";

export default function ProductCard({ product }: ProductCardProps) {
  const specs = [
    { label: "CPU", value: product.specifications.cpu },
    { label: "الذاكرة", value: product.specifications.memory },
    { label: "التخزين", value: product.specifications.storage },
    { label: "النطاق", value: product.specifications.bandwidth },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121115]/95 p-6 shadow-[0_18px_50px_rgba(17,24,39,0.45)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.10),transparent_35%)] opacity-100" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* المحتوى العلوي والمواصفات */}
      <div className="relative z-10 flex flex-1 flex-col text-right">
        <div className="mb-5 flex items-center gap-3 text-primary">
          <ServerCog className="h-5 w-5" />
          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-end justify-between gap-4">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                السعر
              </p>
              <div className="mt-1 flex items-center gap-2 text-white">
                <span className="text-2xl font-bold">
                  € {product.base_price}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {product.billing_cycle}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-right text-xs text-muted-foreground">
          {specs.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>{product.specifications.ddos}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            <span>{product.specifications.location}</span>
          </div>
        </div>
      </div>

      <Button className="relative z-10 mt-6 w-full" variant="default">
        اطلب الخادم
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </motion.article>
  );
}
