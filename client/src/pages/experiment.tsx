import { useParams } from "wouter";
import React from "react";
import Header from "@/components/header";
import ChemicalEquilibriumApp from "@/experiments/ChemicalEquilibrium/components/ChemicalEquilibriumApp";
import OxalicAcidApp from "@/experiments/OxalicAcidStandardization/components/OxalicAcidApp";
import EquilibriumShiftApp from "@/experiments/EquilibriumShift/components/EquilibriumShiftApp";
import FeSCNEquilibriumApp from "@/experiments/FeSCNEquilibrium/components/FeSCNEquilibriumApp";
import Titration1App from "@/experiments/Titration1/components/Titration1App";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Experiment() {
  const { id } = useParams<{ id: string }>();
  const experimentId = parseInt(id || "1");

  // Support for available experiments
  const getExperimentComponent = () => {
    switch (experimentId) {
      case 1:
        return <EquilibriumShiftApp onBack={() => window.history.back()} />;
      case 2:
        return <OxalicAcidApp onBack={() => window.history.back()} />;
      case 3:
        return <FeSCNEquilibriumApp onBack={() => window.history.back()} />;
      case 4:
        return <ChemicalEquilibriumApp onBack={() => window.history.back()} />;
      case 5:
        return <ChemicalEquilibriumApp onBack={() => window.history.back()} />;
      case 6:
        return <Titration1App onBack={() => window.history.back()} />;
      default:
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Experiment Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The requested experiment (ID: {experimentId}) is not available.
                Please select a valid experiment from the home page.
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {getExperimentComponent()}
    </div>
  );
}
