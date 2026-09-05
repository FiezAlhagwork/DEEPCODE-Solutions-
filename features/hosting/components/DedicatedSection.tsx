import { Cpu, ArrowLeft } from "lucide-react";
import Products from "./Products";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function DedicatedSection() {
  const t = useTranslations("hosting.dedicatedSection");

  return (
    <section className="relative overflow-hidden px-6 py-16">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex justify-center items-center gap-5 text-center ">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Cpu className="h-4 w-4" />
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

        <Products type="kvm" category="dedicated" limit={3} />

        <div className="flex justify-center items-center">
          <Button asChild className="relative z-10 mt-6 text-md  " variant="default">
            <Link href="/hosting/dedicated">
              {t("cta")}
              <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
