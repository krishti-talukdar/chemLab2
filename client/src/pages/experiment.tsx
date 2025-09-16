import { useParams } from "wouter";
import React from "react";
import Header from "@/components/header";
import ChemicalEquilibriumApp from "@/experiments/ChemicalEquilibrium/components/ChemicalEquilibriumApp";
import OxalicAcidApp from "@/experiments/OxalicAcidStandardization/components/OxalicAcidApp";
import EquilibriumShiftApp from "@/experiments/EquilibriumShift/components/EquilibriumShiftApp";
import FeSCNEquilibriumApp from "@/experiments/FeSCNEquilibrium/components/FeSCNEquilibriumApp";
import Titration1App from "@/experiments/Titration1/components/Titration1App";
import LassaigneApp from "@/experiments/LassaigneTest/components/LassaigneApp";
import GenericExperimentApp from "@/experiments/Generic/components/GenericExperimentApp";
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
      case 7:
        return <LassaigneApp onBack={() => window.history.back()} />;
      case 8:
        return (
          <GenericExperimentApp experimentId={experimentId} onBack={() => window.history.back()} />
        );
      default:
        return (
          <GenericExperimentApp experimentId={experimentId} onBack={() => window.history.back()} />
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
