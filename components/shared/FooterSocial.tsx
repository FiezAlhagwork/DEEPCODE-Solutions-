import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { footerSocialLinks } from "@/constants/Site";
import Button from "@/components/shared/Button";

export default function FooterSocial() {
  const t = useTranslations("footer");

  return (
    <div className="flex flex-col gap-4 text-start">
      <h3 className="text-base font-semibold text-white">{t("socialTitle")}</h3>

      <div className="flex items-center gap-3">
        {footerSocialLinks.map((social) => {
          const Icon = LucideIcons[social.iconName] as LucideIcons.LucideIcon;

          return (
            <Button
              key={social.label}
              href={social.href}
              variant="icon"
              size="icon-lg"
              aria-label={social.label}
            >
              {Icon && <Icon className="size-4" strokeWidth={2} aria-hidden />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
