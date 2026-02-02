import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { Link, useRoute } from "wouter";
import SafetyGuideModal from "./safety-guide-modal";
import ProgressModal from "./progress-modal";
import SignInModal from "./sign-in-modal";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExperimentPage] = useRoute("/experiment/:id");

  if (isExperimentPage) {
    return (
      <header className="bg-transparent border-none">
        <div className="fixed top-3 right-3 z-50">
          <SafetyGuideModal>
            <button className="px-4 py-2 rounded-full text-white font-semibold shadow-md bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400">
              Safety Guide
            </button>
          </SafetyGuideModal>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-emerald-800" />
              <h1 className="text-lg font-semibold text-emerald-900">AgriVerse</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <SignInModal>
              <Button className="bg-emerald-800 text-white hover:bg-emerald-900">
                Sign In
              </Button>
            </SignInModal>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="px-4">
                <SignInModal>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Sign In
                  </Button>
                </SignInModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
