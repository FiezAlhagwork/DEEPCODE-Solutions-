import { FeatureData, PricingPlan } from "@/types";

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
