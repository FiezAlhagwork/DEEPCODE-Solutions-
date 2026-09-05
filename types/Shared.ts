import * as LucideIcons from "lucide-react";

export type NavigationOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** `key` resolves against the `footer.links` message namespace. */
export type FooterLink = {
  key: string;
  href: string;
};

/** Social network names are brand names, so they stay untranslated. */
export type FooterSocialLink = {
  label: string;
  href: string;
  iconName: keyof typeof LucideIcons;
};

/** `key` resolves against the `contact.info` message namespace. */
export type ContactInfoData = {
  key: string;
  iconName: keyof typeof LucideIcons;
};
