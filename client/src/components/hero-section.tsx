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
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wider italic" style={{ fontFamily: '"Playfair Display", serif' }}>BORPAT</h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-6">
            Explore the essence of Assam's tea and agriculture through our interactive virtual experience. Discover cultivation techniques, process tea leaves firsthand, and trace every step from plantation to perfect brew.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-lg overflow-hidden shadow-lg bg-white">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2Fad98c6c3ddea42d5aa58f45a14038f5b?format=webp&width=800&height=1200" alt="One-horned rhino" className="w-full h-48 object-cover"/>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg bg-white">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F65f93d514a034dd48ade5031e70434a0?format=webp&width=800&height=1200" alt="Assam tea gardens" className="w-full h-48 object-cover"/>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg bg-white">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F4bcb006d94e144a3a13590ea32f3839e?format=webp&width=800&height=1200" alt="Agriculture" className="w-full h-48 object-cover"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
