import { useTranslations } from "next-intl";
import { footerNavLinks } from "@/constants/Site";
import { Link } from "@/i18n/navigation";

export default function FooterLinks() {
  const t = useTranslations("footer");

  return (
    <div className="flex flex-col gap-4 text-start">
      <h3 className="text-base font-semibold text-white">{t("linksTitle")}</h3>

      <ul className="flex flex-col gap-3">
        {footerNavLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {t(`links.${link.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
