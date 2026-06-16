import { HostingHeroProps } from "@/types/hosting";

const HostingHero = ({ badge, title, description }: HostingHeroProps) => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16">
      <div className="max-w-7xl  mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {badge}
          </span>

          <h1 className="mb-6 text-4xl font-bold md:text-6xl">{title}</h1>

          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default HostingHero;
