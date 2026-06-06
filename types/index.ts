import * as LucideIcons from "lucide-react";

export interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AnimatedCounterProps {
  from: number;
  to: number;
}

export interface FeatureData {
  iconName: keyof typeof LucideIcons;
  title: string;
  description: string;
}
export interface FeatureCardProps {
  feature: FeatureData;
}
export interface FeatureListProps {
  features: FeatureData[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  featured?: boolean;
}

export interface PricingCardProps {
  plan: PricingPlan;
}


