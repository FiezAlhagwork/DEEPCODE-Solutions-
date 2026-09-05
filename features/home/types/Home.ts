import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

export type AnimatedCounterProps = {
  from: number;
  to: number;
};

/** `key` resolves against the `features.items` message namespace. */
export type FeatureItem = {
  key: string;
  iconName: keyof typeof LucideIcons;
};

export type FeatureCardProps = {
  feature: FeatureItem;
};

export type FeatureListProps = {
  features: FeatureItem[];
};

/** `key` resolves against the `services.items` message namespace. */
export type ServiceItem = {
  key: string;
  icon: LucideIcon;
};

export type ServiceCardProps = {
  service: ServiceItem;
};

export type ServiceListProps = {
  services: ServiceItem[];
};

/** `key` resolves against the `pricing.plans` message namespace. */
export type PricingPlan = {
  key: string;
  price: number;
  currency: string;
  featured?: boolean;
};

export type PricingCardProps = {
  plan: PricingPlan;
};

export type PricingListProps = {
  PricingPlans: PricingPlan[];
};

export type ContactInfoItemProps = {
  iconName: keyof typeof LucideIcons;
  title: string;
  detail: string;
};

export type FieldProps = {
  label: string;
  iconName: keyof typeof LucideIcons;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export type InputProps = ComponentProps<"input">;

export type TextareaProps = ComponentProps<"textarea">;
