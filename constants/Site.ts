import type {
  ContactInfoData,
  FooterLink,
  FooterSocialLink,
} from "@/types/Shared";

// Root-relative so the links resolve from any route, not just the home page.
export const footerNavLinks: FooterLink[] = [
  { key: "about", href: "/#about" },
  { key: "services", href: "/#services" },
  { key: "pricing", href: "/#pricing" },
  { key: "contact", href: "/#contact" },
];

export const footerSocialLinks: FooterSocialLink[] = [
  { label: "GitHub", href: "https://github.com", iconName: "Github" },
  { label: "LinkedIn", href: "https://linkedin.com", iconName: "Linkedin" },
  { label: "Instagram", href: "https://instagram.com", iconName: "Instagram" },
];

export const contactInfoItems: ContactInfoData[] = [
  { key: "visit", iconName: "MapPin" },
  { key: "call", iconName: "Phone" },
  { key: "email", iconName: "Mail" },
];
