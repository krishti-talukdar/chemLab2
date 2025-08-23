import React, { useState, useCallback, useEffect } from "react";
import { Equipment } from "./Equipment";
import { WorkBench } from "./WorkBench";
import { Chemical } from "./Chemical";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FlaskConical, Scale, BookOpen, Calculator } from "lucide-react";
import {
  OXALIC_ACID_CHEMICALS,
  OXALIC_ACID_EQUIPMENT,
  DEFAULT_MEASUREMENTS,
} from "../constants";
import type {
  EquipmentPosition,
  SolutionPreparationState,
  Measurements,
  Result,
  ExperimentStep,
} from "../types";

interface OxalicAcidVirtualLabProps {
  step: ExperimentStep;
  onStepComplete: () => void;
  isActive: boolean;
  stepNumber: number;
  totalSteps: number;
  experimentTitle: string;
  allSteps: ExperimentStep[];
  experimentStarted: boolean;
  onStartExperiment: () => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  onResetTimer: () => void;
}

function OxalicAcidVirtualLab({
  step,
  onStepComplete,
  isActive,
  stepNumber,
  totalSteps,
  experimentTitle,
  allSteps,
  experimentStarted,
  onStartExperiment,
  isRunning,
  setIsRunning,
  onResetTimer,
}: OxalicAcidVirtualLabProps) {
  const [equipmentPositions, setEquipmentPositions] = useState<
    EquipmentPosition[]
  >([]);
  const [preparationState, setPreparationState] = useState<SolutionPreparationState>({
    oxalicAcidAdded: false,
    waterAdded: false,
    stirrerActive: false,
    dissolved: false,
    transferredToFlask: false,
    nearMark: false,
    finalVolume: false,
    mixed: false,
  });
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [results, setResults] = useState<Result[]>([]);

  const addResult = useCallback((result: Omit<Result, "id" | "timestamp">) => {
    const newResult: Result = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setResults((prev) => [...prev, newResult]);
  }, []);

  const handleCalculation = useCallback(() => {
    // Calculate required mass for 0.1 M solution in 250 mL
    const molarity = 0.1;
    const volume = 0.25; // L
    const molecularWeight = 126.07; // g/mol
    const requiredMass = molarity * volume * molecularWeight;

    setMeasurements(prev => ({
      ...prev,
      targetMass: requiredMass,
    }));

    addResult({
      type: "calculation",
      title: "Mass Calculation Complete",
      description: `Required mass: ${requiredMass.toFixed(4)} g`,
      calculation: {
        massWeighed: requiredMass,
        molarity: molarity,
        moles: molarity * volume,
        procedure: "M = n/V, n = m/MW, therefore m = M × V × MW",
        notes: [
          `Molarity = ${molarity} M`,
          `Volume = ${volume} L`,
          `Molecular Weight = ${molecularWeight} g/mol`,
          `Required mass = ${requiredMass.toFixed(4)} g`
        ],
      },
    });
  }, [addResult]);

  const handleWeighing = useCallback(() => {
    // Simulate weighing with slight variation
    const targetMass = measurements.targetMass;
    const actualMass = targetMass + (Math.random() - 0.5) * 0.01; // ±0.005g variation
    
    setMeasurements(prev => ({
      ...prev,
      massWeighed: actualMass,
      actualMolarity: actualMass / (126.07 * 0.25), // Calculate actual molarity
    }));

    setPreparationState(prev => ({ ...prev, oxalicAcidAdded: true }));

    addResult({
      type: "success",
      title: "Weighing Complete",
      description: `Accurately weighed ${actualMass.toFixed(4)} g`,
      calculation: {
        massWeighed: actualMass,
        accuracy: Math.abs((actualMass - targetMass) / targetMass * 100).toFixed(3) + "% error",
      },
    });
  }, [measurements.targetMass, addResult]);

  const handleDissolving = useCallback(() => {
    setPreparationState(prev => ({ 
      ...prev, 
      waterAdded: true, 
      stirrerActive: true 
    }));

    setTimeout(() => {
      setPreparationState(prev => ({ 
        ...prev, 
        dissolved: true, 
        stirrerActive: false 
      }));
      
      addResult({
        type: "success",
        title: "Dissolution Complete",
        description: "Oxalic acid completely dissolved in water",
      });
    }, 3000);
  }, [addResult]);

  const handleTransfer = useCallback(() => {
    setPreparationState(prev => ({ ...prev, transferredToFlask: true }));
    
    addResult({
      type: "success",
      title: "Transfer Complete",
      description: "Solution transferred to volumetric flask",
    });
  }, [addResult]);

  const handleNearMark = useCallback(() => {
    setPreparationState(prev => ({ ...prev, nearMark: true }));
    
    addResult({
      type: "warning",
      title: "Near Volume Mark",
      description: "Add final water drops carefully to reach the mark",
    });
  }, [addResult]);

  const handleFinalVolume = useCallback(() => {
    setPreparationState(prev => ({ ...prev, finalVolume: true }));
    
    addResult({
      type: "success",
      title: "Volume Adjusted",
      description: "Meniscus aligned with 250 mL mark",
    });
  }, [addResult]);

  const handleFinalMixing = useCallback(() => {
    setPreparationState(prev => ({ ...prev, mixed: true }));
    
    const finalMolarity = measurements.massWeighed / (126.07 * 0.25);
    const percentError = Math.abs((finalMolarity - 0.1) / 0.1 * 100);
    
    setMeasurements(prev => ({
      ...prev,
      actualMolarity: finalMolarity,
    }));
    
    addResult({
      type: "success",
      title: "Standardization Complete",
      description: `Final molarity: ${finalMolarity.toFixed(6)} M`,
      calculation: {
        molarity: finalMolarity,
        percentError: percentError,
        accuracy: percentError < 1 ? "Excellent" : percentError < 3 ? "Good" : "Acceptable",
        notes: [
          `Actual mass used: ${measurements.massWeighed.toFixed(4)} g`,
          `Final volume: 250.0 mL`,
          `Calculated molarity: ${finalMolarity.toFixed(6)} M`,
          `Percent error: ${percentError.toFixed(3)}%`
        ],
      },
    });
  }, [measurements.massWeighed, addResult]);

  const handleStepAction = useCallback(() => {
    switch (step.id) {
      case 1:
        handleCalculation();
        break;
      case 2:
        handleWeighing();
        break;
      case 3:
        handleDissolving();
        break;
      case 4:
        handleTransfer();
        break;
      case 5:
        handleNearMark();
        break;
      case 6:
        handleFinalVolume();
        break;
      case 7:
        handleFinalMixing();
        break;
    }
  }, [step.id, handleCalculation, handleWeighing, handleDissolving, handleTransfer, handleNearMark, handleFinalVolume, handleFinalMixing]);

  const canProceed = useCallback(() => {
    switch (step.id) {
      case 1:
        return measurements.targetMass > 0;
      case 2:
        return preparationState.oxalicAcidAdded;
      case 3:
        return preparationState.dissolved;
      case 4:
        return preparationState.transferredToFlask;
      case 5:
        return preparationState.nearMark;
      case 6:
        return preparationState.finalVolume;
      case 7:
        return preparationState.mixed;
      default:
        return false;
    }
  }, [step.id, measurements.targetMass, preparationState]);

  useEffect(() => {
    if (canProceed() && isActive) {
      const timer = setTimeout(() => {
        onStepComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [canProceed, isActive, onStepComplete]);

  return (
    <TooltipProvider>
      <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <WorkBench
          step={step}
          experimentStarted={experimentStarted}
          onStartExperiment={onStartExperiment}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          onResetTimer={onResetTimer}
          stepNumber={stepNumber}
          totalSteps={totalSteps}
          experimentTitle={experimentTitle}
          onStepAction={handleStepAction}
          canProceed={canProceed()}
          equipmentPositions={equipmentPositions}
          setEquipmentPositions={setEquipmentPositions}
          preparationState={preparationState}
          measurements={measurements}
          results={results}
          chemicals={OXALIC_ACID_CHEMICALS}
          equipment={OXALIC_ACID_EQUIPMENT}
        />
      </div>
    </TooltipProvider>
  );
}

export default OxalicAcidVirtualLab;
