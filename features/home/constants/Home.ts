import {
  Globe,
  MonitorSmartphone,
  Smartphone,
  Palette,
  Figma,
  Server,
} from "lucide-react";
import type { FeatureItem, PricingPlan, ServiceItem } from "../types/Home";

// Only structure lives here — every string comes from messages/<locale>.json,
// keyed by `key` under the matching namespace.

export const pricingPlans: PricingPlan[] = [
  { key: "startup", price: 199, currency: "USD" },
  { key: "professional", price: 399, currency: "USD", featured: true },
  { key: "complete", price: 379, currency: "USD" },
];

export const featureItems: FeatureItem[] = [
  { key: "impact", iconName: "Sparkle" },
  { key: "quality", iconName: "Gem" },
  { key: "innovation", iconName: "Brain" },
];

export const serviceItems: ServiceItem[] = [
  { key: "web", icon: Globe },
  { key: "webApps", icon: MonitorSmartphone },
  { key: "mobile", icon: Smartphone },
  { key: "graphic", icon: Palette },
  { key: "uiux", icon: Figma },
  { key: "hosting", icon: Server },
];
