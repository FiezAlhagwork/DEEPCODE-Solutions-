
import { ShieldCheck, ServerCog, Cpu } from "lucide-react";
import Products from "../hosting/Products";

export default function DedicatedSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col gap-5 text-right md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Cpu className="h-4 w-4" />
              Dedicated Servers
            </span>

            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              خوادم مخصصة بأداء احترافي وتحكم كامل
            </h2>

            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              احصل على سيرفر كامل بموارد حصرية وأداء ثابت للمشاريع الكبيرة
              والتطبيقات ذات الأحمال العالية.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              موارد مخصصة
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              أداء ثابت
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              تحكم كامل
            </span>
          </div>
        </div>

        <Products
          type="kvm"
          category="dedicated"
          limit={3}
        />

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>حماية متقدمة للشبكة والبنية التحتية</span>

          <ServerCog className="h-4 w-4 text-primary" />
          <span>خوادم احترافية مخصصة بالكامل</span>
        </div>
      </div>
    </section>
  );
}