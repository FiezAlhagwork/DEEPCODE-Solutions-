import ContactForm from "./ui/ContactForm";
import ContactInfo from "./ui/ContactInfo";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full  px-6 py-16 md:py-24"
      dir="rtl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[-15%] z-0 h-125 w-60 opacity-40 mix-blend-screen select-none md:h-140 md:w-150"
      >
        <div className="absolute inset-0 bg-[url('/Ellipse5.png')] bg-contain bg-right bg-no-repeat blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/Ellipse4.png')] bg-contain bg-right bg-no-repeat blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary">
            تواصل معنا
          </span>

          <h2
            id="contact-heading"
            className="text-3xl font-medium text-white md:text-4xl"
          >
            دعنا نساعدك بنجاح مشروعك
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            نحن بجانبك لنخطط معاً لتحويل أفكارك إلى منتجات رقمية ناجحة
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
