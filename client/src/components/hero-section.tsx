import { Button } from "@/components/ui/button";
import { Play, Book } from "lucide-react";
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
    <section className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wider drop-shadow-lg">
            BORPAT
          </h2>
          <p className="text-lg mb-8 text-emerald-100 max-w-3xl mx-auto drop-shadow-md">
            Experience hands-on chemistry learning with our interactive virtual laboratory.
            Conduct real experiments safely and track your progress step by step.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={scrollToExperiments}
              className="bg-white text-emerald-700 px-6 py-2 rounded-sm w-28 h-10 font-semibold"
            >
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
            <SafetyGuideModal>
              <Button
                variant="outline"
                className="bg-white text-emerald-700 px-6 py-2 rounded-sm w-28 h-10 font-semibold"
              >
                <Book className="mr-2 h-4 w-4" />
                Safety
              </Button>
            </SafetyGuideModal>
          </div>
        </div>
      </div>
    </section>
  );
}
