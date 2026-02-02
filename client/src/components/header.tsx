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

  return null;
}
