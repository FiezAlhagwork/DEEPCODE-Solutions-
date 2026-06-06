import About from "@/components/About";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0E]">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Pricing />
    </main>
  );
}
