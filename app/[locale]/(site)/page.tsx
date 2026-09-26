import { setRequestLocale } from "next-intl/server";
import { requireLocale } from "@/i18n/Locale";
import Hero from "@/features/home/components/Hero";
import About from "@/features/home/components/About";
import Features from "@/features/home/components/Features";
import Services from "@/features/home/components/Services";
// import Pricing from "@/features/home/components/Pricing";
import Contact from "@/features/home/components/Contact";
import ProjectsSection from "@/features/projects/components/ProjectsSection";
import Team from "@/features/team/components/Team";
import VPSSection from "@/features/hosting/components/VPSSection";
// import DedicatedSection from "@/features/hosting/components/DedicatedSection";
import ScrollToTop from "@/components/shared/ScrollToTop";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function Home({ params }: LocaleRouteProps) {
  setRequestLocale(requireLocale((await params).locale));

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Features />
      <Services />
      <ProjectsSection />
      <Team />
      {/* Hidden, not deleted: the packages section didn't read as professional
          enough. The component and its copy are still in features/home. */}
      {/* <Pricing /> */}
      <VPSSection />
      {/* <DedicatedSection /> */}
      <Contact />
      <ScrollToTop />
    </main>
  );
}
