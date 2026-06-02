import { Crosshair, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const pills = [
  { label: "بساطة", active: false },
  { label: "وثوقية", active: true },
  { label: "جودة", active: false },
];

export function Hero() {
  return (
    <section
      aria-label="Hero Introduction"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6  pb-16 overflow-hidden bg-[#0D0D0E]" // تم إضافة لون خلفية داكن ليتناسق مع التصميم ويبرز الـ Blur
    >
      {/* تأثيرات الـ Blur على الجوانب باستخدام الصور المرفقة */}
      {/* الجانب الأيسر (البنفسجي والفاتح) */}
      <div className="absolute left-0 top-3/4 -translate-y-1/2  w-50 md:w-170 h-full pointer-events-none opacity-60 mix-blend-screen select-none z-0">
        <div className="absolute inset-0 bg-[url('/Ellipse1.png')] w-60 md:w-170 h-full bg-no-repeat bg-left bg-contain blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse2.png')]  h-full bg-no-repeat bg-left bg-contain blur-[60px] " />
      </div>

      {/* الجانب الأيمن (النيلي والداكن) */}
      <div className="absolute right-0 top-[70%] -translate-y-1/2  h-full  pointer-events-none opacity-60 mix-blend-screen select-none z-0">
        <div className="absolute inset-0 bg-[url('/Ellipse5.png')] w-60 md:w-170 h-full  bg-no-repeat bg-right bg-contain blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse4.png')] w-20 md:w-110 h-full  bg-no-repeat bg-right bg-contain blur-[60px] " />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Pills */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {pills.map((pill) => (
            <span
              key={pill.label}
              className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                pill.active
                  ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pill.active && (
                <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 animate-pulse" />
              )}
              {pill.label}
            </span>
          ))}
        </div>

        {/* Heading  */}
        <h1 className="text-[28px] md:text-5xl lg:text-5xl font-bold leading-tight text-balance text-white ">
          وجهتك الآمنة <span className="text-primary">لحضور رقمي</span> متكامل
        </h1>

        {/* Description */}
        <p className="text-md md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
          نحول أفكارك إلى تجارب رقمية استثنائية تلبي احتياجات عملائك وتدعم نجاحك
          وتطورك في عالم الاعمال
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Button
            size="lg"
            variant="default"
          >
            <Rocket className="w-5 h-5" />
            احجز استشارتك المجانية
          </Button>
          <Button
            size="lg"
            className=""
            variant="outline"
          >
            <Crosshair className="w-5 h-5" />
            اكتشف حلولنا التقنية
          </Button>
        </div>

        {/* Stats Card */}
        <div className="w-full max-w-md  border border-primary/50 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group  transition-colors duration-300">
          {/* Subtle inside glow corner */}
          <div className="absolute top-0 right-0 w-24 h-24 radial-glow opacity-30 pointer-events-none" />

          <dl className="grid grid-cols-2 divide-x divide-gray-800/80">
            {/* Satisfied clients */}
            <div className={`px-4 flex flex-col items-center `}>
              <dt className="text-gray-200 text-xs md:text-lg font-medium mb-1">
                عميل راضي
              </dt>
              <dd className="font-sans font-bold text-3xl md:text-4xl  text-primary bg-clip-text bg-linear-to-br from-white to-purple-200 tracking-tight">
                +50
              </dd>
            </div>

            {/* Sustainable success */}
            <div className={`px-4 flex flex-col items-center `}>
              <dt className="text-gray-200 text-xs md:text-lg font-medium mb-1">
                نجاح مستدام
              </dt>
              <dd className="font-sans font-bold text-3xl md:text-4xl  text-primary bg-clip-text bg-linear-to-br from-white to-purple-200 tracking-tight">
                +30
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </section>
  );
}
