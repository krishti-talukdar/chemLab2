import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import SafetyGuideModal from "./safety-guide-modal";
import SignInModal from "./sign-in-modal";

export default function HeroSection() {
  const [, navigate] = useLocation();

  const scrollToExperiments = () => {
    const experimentsSection = document.getElementById('experiments');
    if (experimentsSection) {
      experimentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-hero-green text-white py-20 relative">
      <div className="absolute top-4 right-4 z-50 hidden md:block">
          <SignInModal>
            <Button className="bg-emerald-800 text-white hover:bg-emerald-900">
              Sign In
            </Button>
          </SignInModal>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wider italic" style={{ fontFamily: '"Playfair Display", serif' }}>BORPAT <span className="not-italic">ai</span></h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-6">
            Explore the essence of Assam's tea and agriculture through our interactive virtual experience. Discover cultivation techniques, process tea leaves firsthand, and trace every step from plantation to perfect brew.
          </p>

          <div className="mt-10">
            <div className="relative mx-auto w-full max-w-4xl h-64 md:h-80 lg:h-96">
              {/* Left image */}
              <div className="absolute left-0 top-6 w-5/12 md:w-4/12 transform -rotate-6 rounded-lg overflow-hidden shadow-2xl">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2Fad98c6c3ddea42d5aa58f45a14038f5b?format=webp&width=1200&height=800" alt="One-horned rhino" className="w-full h-full object-cover"/>
              </div>

              {/* Center image */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-7/12 md:w-5/12 z-20 rounded-xl overflow-hidden shadow-2xl">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F65f93d514a034dd48ade5031e70434a0?format=webp&width=1400&height=900" alt="Assam tea gardens" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Right image */}
              <div className="absolute right-0 top-10 w-5/12 md:w-4/12 transform rotate-6 rounded-lg overflow-hidden shadow-2xl">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F4bcb006d94e144a3a13590ea32f3839e?format=webp&width=1200&height=800" alt="Agriculture" className="w-full h-full object-cover"/>
              </div>

              {/* Subtle border overlay for depth */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
