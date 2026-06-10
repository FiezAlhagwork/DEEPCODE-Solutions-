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


export interface PricingListProps {
  PricingPlans: PricingPlan[]
}

export interface ContactInfoData {
  iconName: keyof typeof LucideIcons;
  title: string;
  detail: string;
}

export interface ContactInfoItemProps {
  item: ContactInfoData;
}


export interface FieldProps {
  label: string;
  iconName: keyof typeof LucideIcons;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}


export interface TextareaProps
  extends React.ComponentProps<"textarea"> { }

export interface InputProps extends React.ComponentProps<"input"> { }

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocialLink {
  label: string;
  href: string;
  iconName: keyof typeof LucideIcons;
}