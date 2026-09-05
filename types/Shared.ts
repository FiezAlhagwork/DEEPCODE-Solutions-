import * as LucideIcons from "lucide-react";
import type { Messages } from "next-intl";

export type NavigationOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** `key` resolves against the `footer.links` message namespace. */
export type FooterLink = {
  key: keyof Messages["footer"]["links"];
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
  key: keyof Messages["contact"]["info"];
  iconName: keyof typeof LucideIcons;
};
