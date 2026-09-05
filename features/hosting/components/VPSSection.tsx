import { ArrowLeft, Sparkles } from "lucide-react";
import Products from "./Products";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function VPSSection() {
  const t = useTranslations("hosting.vpsSection");

  return (
    <section className="relative overflow-hidden px-6 py-16 md:pt-28 " id="server">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex justify-center gap-5 text-center ">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_24px_rgba(168,85,247,0.18)]">
              <Sparkles className="h-4 w-4" />
              {t("badge")}
            </span>

            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              {t("title")}
            </h2>

            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              {t("description")}
            </p>
          </div>
        </div>

        <Products type="kvm" limit={3} />

        <Link href="/hosting/vps" className="flex justify-center items-center">
          <Button   className="relative z-10 mt-6 text-md  " variant="default">
            {t("cta")}
            <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
