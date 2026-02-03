import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

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

        {/* Top-right menu logo button */}
        <div className="absolute top-4 right-4 z-50">
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-700/80 hover:bg-emerald-700 text-white shadow-lg">
                <span className="text-xl">☰</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="w-64 bg-emerald-900 text-white p-4 rounded-xl shadow-2xl">
              <DialogHeader className="!p-0 mb-2">
                <DialogTitle className="text-lg font-semibold">Menu</DialogTitle>
                <DialogDescription className="text-sm text-amber-50/80">Quick links</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3 mt-2">
                <button onClick={() => { setMenuOpen(false); setAboutOpen(true); }} className="w-full text-left rounded px-3 py-2 bg-gradient-to-r from-amber-400 to-emerald-600 text-white font-medium">Know More About Us</button>

                <button onClick={() => { setMenuOpen(false); navigate('/subscription'); }} className="w-full text-left rounded px-3 py-2 bg-gradient-to-r from-amber-400 to-emerald-600 text-white font-medium">Buy Products from us</button>

                <button onClick={() => { setMenuOpen(false); navigate('/detection'); }} className="w-full text-left rounded px-3 py-2 bg-gradient-to-r from-amber-400 to-emerald-600 text-white font-medium">More about Detection Centre</button>

                <button onClick={() => { const el = document.getElementById('about-assam'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="w-full text-left rounded px-3 py-2 bg-white text-emerald-800 font-medium">Contact Us</button>
              </div>
            </DialogContent>
          </Dialog>
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

              {/* Center action: Scan tea disease */}
              <div className="absolute left-1/2 top-[70%] -translate-x-1/2 z-20">
                <Button onClick={() => navigate('/detection')} style={{ fontFamily: '"Inter", sans-serif' }} className="bg-gradient-to-r from-yellow-400 to-emerald-700 text-white px-6 py-4 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-200 text-xl font-bold tracking-wide font-sans">
                  <span className="mr-3">🔬</span> Scan tea disease
                </Button>
              </div>

            </div>

            {/* Lower action buttons: detection (left) and sign up (right) */}
            <div className="absolute left-0 right-0 bottom-6 px-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <Button onClick={() => navigate('/detection')} className="flex-1 md:flex-none bg-gradient-to-r from-amber-400 to-emerald-600 text-white px-4 py-2 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200 font-semibold">
                  <span className="mr-2">🧪</span> BORPAT ai Detection Centre
                </Button>

                <SignInModal>
                  <Button className="flex-1 md:flex-none bg-gradient-to-r from-amber-400 to-emerald-600 text-white px-5 py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200 font-semibold tracking-wide font-serif">
                    <span className="mr-2">✨</span> Sign Up
                  </Button>
                </SignInModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
