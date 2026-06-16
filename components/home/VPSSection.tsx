import { ArrowLeft, Sparkles } from "lucide-react";
import Products from "../hosting/Products";
import Link from "next/link";
import { Button } from "../ui/button";

export default function VPSSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:pt-28 " id="server">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex justify-center gap-5 text-center ">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_24px_rgba(168,85,247,0.18)]">
              <Sparkles className="h-4 w-4" />
              أفضل عروض VPS
            </span>

            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              خوادم VPS سريعة وآمنة
            </h2>

            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              اختر بين باقات جاهزة بأداء ممتاز، دعم فني متواصل، ومرونة في
              الاستخدام.
            </p>
          </div>
        </div>

        <Products type="kvm" limit={3} />

        <Link href="/hosting/vps" className="flex justify-center items-center">
          <Button   className="relative z-10 mt-6 text-md  " variant="default">
            عرض جميع العروص Vps
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
