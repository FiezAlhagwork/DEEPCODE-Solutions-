import {
  Globe,
  MonitorSmartphone,
  Smartphone,
  Palette,
  Figma,
  Server,
} from "lucide-react";
import { ContactInfoData, FeatureData, FooterLink, FooterSocialLink, PricingPlan, ServiceData } from "@/types";

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

export const pricingPlans: PricingPlan[] = [
  {
    id: "startup",
    name: "البداية",
    price: 199,
    currency: "USD",
    period: "السنة",
    features: ["حتى 5 صفحات", "تصميم صفحات مخصص"],
  },
  {
    id: "professional",
    name: "الاحترافية",
    price: 399,
    currency: "USD",
    period: "السنة",
    featured: true,
    features: [
      "تشمل مميزات الباقة الكاملة",
      "صيانة لمدة 12 شهراً",
      "تهيئة SEO أساسية",
      "دعم فني بأولوية",
      "لغة إضافية واحدة (عربي - انجليزي)",
    ],
  },
  {
    id: "complete",
    name: "كاملة",
    price: 379,
    currency: "USD",
    period: "السنة",
    features: [
      "حتى 5 صفحات",
      "تصميم صفحات مخصص",
      "نطاق .com",
      "استضافة سريعة وآمنة + SSL",
      "نموذج تواصل يرتبط ببريدك الالكتروني",
      "أعداد وتهيئة كاملة",
    ],
  },
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

export const featuresData: FeatureData[] = [
  {
    iconName: "Sparkle",
    title: "الأثر",
    description: "نتائج مستدامة",
  },
  {
    iconName: "Gem",
    title: "الجودة",
    description: "ضمان التوسع والصيانة",
  },
  {
    iconName: "Brain",
    title: "الابتكار",
    description: "ريادة التقنيات",
  },
];


export const services: ServiceData[] = [
  {
    title: "تطوير المواقع الإلكترونية",
    description:
      "نصمم ونطور مواقع إلكترونية احترافية سريعة ومتجاوبة مع جميع الأجهزة لتعزيز حضورك الرقمي وإظهار علامتك التجارية بأفضل صورة.",
    icon: Globe,
  },
  {
    title: "تطوير تطبيقات الويب",
    description:
      "نبني تطبيقات ويب مخصصة تلبي احتياجات أعمالك مع التركيز على الأداء العالي وسهولة الاستخدام وقابلية التوسع.",
    icon: MonitorSmartphone,
  },
  {
    title: "تطوير تطبيقات الجوال",
    description:
      "نطور تطبيقات Android و iOS حديثة توفر تجربة استخدام سلسة وتساعدك على الوصول إلى عملائك في أي وقت.",
    icon: Smartphone,
  },
  {
    title: "التصميم الجرافيكي",
    description:
      "نقدم تصاميم إبداعية تشمل الشعارات والهوية البصرية والمواد التسويقية لتعزيز حضور علامتك التجارية.",
    icon: Palette,
  },
  {
    title: "تصميم واجهات وتجربة المستخدم",
    description:
      "نصمم واجهات عصرية وتجارب استخدام مدروسة تضمن سهولة التفاعل وتحسين رضا المستخدمين.",
    icon: Figma,
  },
  {
    title: "الاستضافة وإدارة السيرفرات",
    description:
      "نوفر حلول استضافة وسيرفرات آمنة ومستقرة مع إدارة احترافية لضمان أفضل أداء لموقعك أو تطبيقك.",
    icon: Server,
  },
];  



