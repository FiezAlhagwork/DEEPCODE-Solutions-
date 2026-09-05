import * as LucideIcons from "lucide-react";

export type NavigationOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSocialLink = {
  label: string;
  href: string;
  iconName: keyof typeof LucideIcons;
};

export type ContactInfoData = {
  iconName: keyof typeof LucideIcons;
  title: string;
  detail: string;
};
