import { useState } from "react";
import { useExperiments, useUserProgress } from "@/hooks/use-experiments";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import ExperimentCard from "@/components/experiment-card";
import ExperimentModal from "@/components/experiment-modal";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Experiment } from "@shared/schema";

export default function Home() {
  const { data: experiments, isLoading: experimentsLoading } = useExperiments();
  const { data: userProgress } = useUserProgress();
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Experiments");

  const categories = ["All Experiments", "Quantitative Analysis", "Equilibrium", "Qualitative Analysis", "Acid-Base Chemistry"];

  const filteredExperiments =
    experiments?.filter((exp) => {
      if (selectedCategory === "All Experiments") return true;
      return (
        exp.category === selectedCategory || exp.difficulty === selectedCategory
      );
    }) || [];

  const getProgressForExperiment = (experimentId: number) => {
    return userProgress?.find((p) => p.experimentId === experimentId);
  };

  const handleViewDetails = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      <Footer />

      <ExperimentModal
        experiment={selectedExperiment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
