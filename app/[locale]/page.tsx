import { setRequestLocale } from "next-intl/server";
import { requireLocale } from "@/i18n/Locale";
import Hero from "@/features/home/components/Hero";
import About from "@/features/home/components/About";
import Features from "@/features/home/components/Features";
import Services from "@/features/home/components/Services";
import Pricing from "@/features/home/components/Pricing";
import Contact from "@/features/home/components/Contact";
import ProjectsSection from "@/features/projects/components/ProjectsSection";
import Team from "@/features/team/components/Team";
import VPSSection from "@/features/hosting/components/VPSSection";
// import DedicatedSection from "@/features/hosting/components/DedicatedSection";
import ScrollToTop from "@/components/shared/ScrollToTop";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Features />
      <Services />
      <ProjectsSection />
      <Team />
      <Pricing />
      <VPSSection />
      {/* <DedicatedSection /> */}
      <Contact />
      <ScrollToTop />
    </main>
  );
}
