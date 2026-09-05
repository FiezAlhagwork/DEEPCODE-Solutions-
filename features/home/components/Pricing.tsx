"use client";



import { useTranslations } from "next-intl";
import { pricingPlans } from "@/features/home/constants/Home";
import PricingList from "./PricingList";




export default function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative w-full overflow-hidden  px-6 py-16"
    >
      {/* <PricingJsonLd /> */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0  bg-center opacity-40"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary">
            {t("badge")}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-label={t("limitedTime")}
              className="relative h-5 w-10 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A0E] bg-primary"
            >
              <span
                aria-hidden="true"
                className="absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-out inset-s-1"
              />
            </button>
            <span className="text-sm text-muted-foreground">{t("limitedTime")}</span>
          </div>

          <h2
            id="pricing-heading"
            className="text-3xl font-medium text-white md:text-4xl pt-6"
          >
            {t("title")}
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("description")}
          </p>
        </div>

        <PricingList PricingPlans={pricingPlans} />
      </div>
    </section>
  );
}
