import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { footerSocialLinks } from "@/constants/Site";

export default function FooterSocial() {
  const t = useTranslations("footer");

  return (
    <div className="flex flex-col gap-4 text-start">
      <h3 className="text-base font-semibold text-white">{t("socialTitle")}</h3>

      <div className="flex items-center gap-3">
        {footerSocialLinks.map((social) => {
          const Icon = LucideIcons[social.iconName] as LucideIcons.LucideIcon;

          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[#121115]/80 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              {Icon && <Icon className="size-4" strokeWidth={2} aria-hidden />}
            </a>
          );
        })}
      </div>
    </div>
  );
}
