import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import SafetyGuideModal from "./safety-guide-modal";

export default function HeroSection() {
  const [, navigate] = useLocation();

  const scrollToExperiments = () => {
    const experimentsSection = document.getElementById('experiments');
    if (experimentsSection) {
      experimentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-hero-green text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wider">BORPAT</h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-6">
            Experience hands-on chemistry learning with our interactive virtual laboratory.
            Conduct real experiments safely and track your progress step by step.
          </p>

          <div className="flex justify-center gap-4 mt-6"></div>
        </div>
      </div>
    </section>
  );
}
