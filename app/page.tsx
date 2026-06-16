import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import ScrollToTop from "@/components/shared/ScrollToTop";
import Services from "@/components/home/Services";
import VPSSection from "@/components/home/VPSSection";
import DedicatedSection from "@/components/home/DedicatedSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0E]">
      <Hero />
      <About />
      <Features />
      <Services />
      <Pricing />
      <VPSSection />
      <DedicatedSection />
      <Contact />
      <ScrollToTop />
    </main>
  );
}
