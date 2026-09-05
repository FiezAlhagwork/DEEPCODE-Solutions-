import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ContactInfoData } from "@/types/Shared";

export type AnimatedCounterProps = {
  from: number;
  to: number;
};

export type FeatureData = {
  iconName: keyof typeof LucideIcons;
  title: string;
  description: string;
};

export type FeatureCardProps = {
  feature: FeatureData;
};

export type FeatureListProps = {
  features: FeatureData[];
};

export type ServiceData = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceCardProps = {
  service: ServiceData;
};

export type ServiceListProps = {
  services: ServiceData[];
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  featured?: boolean;
};

export type PricingCardProps = {
  plan: PricingPlan;
};

export type PricingListProps = {
  PricingPlans: PricingPlan[];
};

export type ContactInfoItemProps = {
  item: ContactInfoData;
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
