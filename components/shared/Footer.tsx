import { useTranslations } from "next-intl";
import { contactInfoItems } from "@/constants/Site";
import FooterSocial from "./FooterSocial";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  const t = useTranslations("footer");
  const tInfo = useTranslations("contact.info");
  // Passed as a string so ICU does not group it as a number ("2,026").
  const year = String(new Date().getFullYear());

  return (
    <footer
      aria-label={t("label")}
      className="relative w-full  px-6 py-12 md:pt-16 md:pb-22 bg-[#0D0D0E] "
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          <div className="flex flex-col gap-4 text-start">
            <a href="#" className="inline-block">
              <span className="text-xl font-bold text-primary md:text-2xl">DEEPCODE</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <FooterLinks />

          <div className="flex flex-col gap-4 text-start">
            <h3 className="text-base font-semibold text-white">
              {t("contactTitle")}
            </h3>
            <ul className="flex flex-col gap-5" role="list">
              {contactInfoItems.map((item) => (
                <li
                  key={item.key}
                  className="text-sm hover:text-white gap-3 flex flex-col text-muted-foreground"
                >
                  <span>{tInfo(`${item.key}.detail`)}</span>
                </li>
              ))}
            </ul>
          </div>



          <FooterSocial />

        </div>

        <div className="mt-10">
          <div className="border-t border-white/10 pt-8">
            <p className="text-center text-xs text-muted-foreground md:text-sm">
              {t("copyright", { year })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
