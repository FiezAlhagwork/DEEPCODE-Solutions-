import { useTranslations } from "next-intl";
import { footerNavLinks } from "@/constants/Site";

export default function FooterLinks() {
  const t = useTranslations("footer");

  return (
    <div className="flex flex-col gap-4 text-start">
      <h3 className="text-base font-semibold text-white">{t("linksTitle")}</h3>

      <ul className="flex flex-col gap-3">
        {footerNavLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {t(`links.${link.key}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
