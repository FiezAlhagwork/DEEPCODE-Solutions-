import type {
  ContactInfoData,
  FooterLink,
  FooterSocialLink,
  SiteNavLink,
} from "@/types/Shared";

// The public navbar's links — read by both the desktop bar and the mobile
// drawer, which used to carry two copies of this list. No "home": the logo is
// the home link. "Our work" is new — `/projects` had no way in from the navbar.
export const siteNavLinks: SiteNavLink[] = [
  { key: "about", href: "/#about" },
  { key: "services", href: "/#services" },
  { key: "projects", href: "/projects" },
  { key: "servers", href: "/#server" },
  { key: "contact", href: "/#contact" },
];

// Root-relative so the links resolve from any route, not just the home page.
export const footerNavLinks: FooterLink[] = [
  { key: "about", href: "/#about" },
  { key: "services", href: "/#services" },
  { key: "projects", href: "/projects" },
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
