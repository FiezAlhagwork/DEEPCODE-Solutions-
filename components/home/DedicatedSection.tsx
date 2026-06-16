import { Cpu, ArrowLeft } from "lucide-react";
import Products from "../hosting/Products";
import { Button } from "../ui/button";
import Link from "next/link";

export default function DedicatedSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex justify-center items-center gap-5 text-center ">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Cpu className="h-4 w-4" />
              Dedicated Servers
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              خوادم مخصصة بأداء احترافي
            </h2>

            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              سيرفر كامل بموارد حصرية وأداء ثابت للمشاريع الكبيرة والتطبيقات
              عالية الحمل.
            </p>
          </div>
        </div>

        <Products type="kvm" category="dedicated" limit={3} />

        <Link
          href="/hosting/dedicated"
          className="flex justify-center items-center"
        >
          <Button className="relative z-10 mt-6 text-md  " variant="default">
            عرض جميع العروص Dedicated
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
