import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import SafetyGuideModal from "./safety-guide-modal";
import SignInModal from "./sign-in-modal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
      <div className="absolute top-4 left-4 z-50">
          <Button onClick={() => navigate('/about')} className="bg-gradient-to-r from-amber-400 to-emerald-600 text-white hover:from-amber-500 hover:to-emerald-700 px-5 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200 font-semibold tracking-wide font-serif">
            <span className="mr-2 text-lg">☕</span>
            <span style={{ fontFamily: '"Playfair Display", serif' }}>About ASSAM's Tea</span>
          </Button>
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

              {/* Sign Up button centered below the main image (styled to match About) */}
              <div className="absolute left-1/2 top-[75%] md:top-[78%] -translate-x-1/2 z-30">
                <SignInModal>
                  <Button className="bg-gradient-to-r from-amber-400 to-emerald-600 text-white px-5 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200 font-semibold tracking-wide font-serif">
                    <span className="mr-2">✨</span> Sign Up
                  </Button>
                </SignInModal>
              </div>

            </div>

            {/* Lower action buttons: left, center, right */}
            <div className="absolute left-0 right-0 bottom-6 px-4">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 md:flex-none bg-gradient-to-r from-amber-400 to-emerald-600 text-white px-5 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200 font-semibold tracking-wide font-serif">
                      <span className="mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700">🔎</span>
                      Know More About Us
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl bg-emerald-900 text-white p-6 sm:p-8 rounded-xl shadow-2xl">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <img src="https://cdn.builder.io/api/v1/image/assets%2F3c8edf2c5e3b436684f709f440180093%2F65f93d514a034dd48ade5031e70434a0?format=webp&width=800&height=500" alt="Assam tea gardens" className="w-full sm:w-40 h-28 object-cover rounded-md shadow-inner" />

                      <DialogHeader className="!text-left flex-1">
                        <DialogTitle className="text-2xl font-serif text-amber-100">About BORPAT ai</DialogTitle>
                        <div className="mt-2 text-sm text-amber-50/90 leading-relaxed">
                          <div>
                            We are a forward-thinking agritech and tea solutions company committed to empowering the tea industry through innovation, sustainability, and technology. Our approach merges data-driven intelligence with high-quality agricultural products to help tea growers and buyers thrive in every stage of production.
                          </div>

                          <div className="mt-3">
                            At the heart of our work lies our AI-based pest detection model, designed to help tea estates monitor crop health in real time. By identifying early signs of pest infestation, our technology enables faster decision-making, reduces chemical overuse, and enhances both quality and yield.
                          </div>

                          <div className="mt-3">
                            Alongside technology, we provide a range of eco-conscious pest control products developed to maintain tea garden health naturally and effectively.
                          </div>

                          <div className="mt-3">
                            Through our B2B tea supply solutions, we connect certified tea producers with bulk buyers and exporters who value traceability and sustainability. By bridging technology with tradition, we ensure every cup of tea represents the best of innovation, care, and agricultural excellence.
                          </div>
                        </div>
                      </DialogHeader>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button onClick={() => navigate('/detection')} className="flex-1 md:flex-none bg-gradient-to-r from-amber-400 to-emerald-600 text-white px-4 py-2 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200 font-semibold">
                  <span className="mr-2">🧪</span> BORPAT ai Detection Centre
                </Button>

                <div className="flex-1 md:flex-none">
                  <Button onClick={() => navigate('/subscription')} className="w-full bg-emerald-800 text-white px-4 py-2 rounded-full shadow-md font-semibold inline-flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2l7 10-7 10-7-10 7-10z" />
                    </svg>
                    <span>Subscription</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
