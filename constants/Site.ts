import type {
  ContactInfoData,
  FooterLink,
  FooterSocialLink,
} from "@/types/Shared";

export const footerNavLinks: FooterLink[] = [
  { label: "من نحن", href: "#about" },
  { label: "خدماتنا", href: "#services" },
  { label: "باقات المواقع", href: "#pricing" },
  { label: "تواصل معنا", href: "#contact" },
];

export const footerSocialLinks: FooterSocialLink[] = [
  { label: "GitHub", href: "https://github.com", iconName: "Github" },
  { label: "LinkedIn", href: "https://linkedin.com", iconName: "Linkedin" },
  { label: "Instagram", href: "https://instagram.com", iconName: "Instagram" },
];

export const contactInfoItems: ContactInfoData[] = [
  {
    iconName: "MapPin",
    title: "تفضل بزيارتنا",
    detail: "دمشق - الشعلان",
  },
  {
    iconName: "Phone",
    title: "اتصل بنا",
    detail: "963997013656+",
  },
  {
    iconName: "Mail",
    title: "راسلنا عبر البريد الإلكتروني",
    detail: "codedeep@gmail.com",
  },
];
