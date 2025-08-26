import React, { useState, useEffect, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FlaskConical, Beaker, Droplets, Info, ArrowRight, CheckCircle, Wrench } from "lucide-react";
import { WorkBench } from "./WorkBench";
import { Equipment, LAB_EQUIPMENT } from "./Equipment";
import { 
  COLORS, 
  INITIAL_TESTTUBE, 
  EQUILIBRIUM_STATES, 
  GUIDED_STEPS,
  ANIMATION,
  EQUILIBRIUM_EQUATION 
} from "../constants";
import { 
  TestTube, 
  DropperAction, 
  EquilibriumState, 
  ExperimentMode, 
  ColorTransition,
  ExperimentLog 
} from "../types";

interface VirtualLabProps {
  experimentStarted: boolean;
  onStartExperiment: () => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  mode: ExperimentMode;
  onStepComplete: () => void;
  onReset: () => void;
}

export default function VirtualLab({
  experimentStarted,
  onStartExperiment,
  isRunning,
  setIsRunning,
  mode,
  onStepComplete,
  onReset,
}: VirtualLabProps) {
  // Lab state
  const [testTube, setTestTube] = useState<TestTube>(INITIAL_TESTTUBE);
  const [equilibriumState, setEquilibriumState] = useState<EquilibriumState>(EQUILIBRIUM_STATES.hydrated);
  const [colorTransition, setColorTransition] = useState<ColorTransition | null>(null);
  const [dropperAction, setDropperAction] = useState<DropperAction | null>(null);
  const [experimentLog, setExperimentLog] = useState<ExperimentLog[]>([]);
  const [showToast, setShowToast] = useState<string>("");
  
  // Workbench state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [equipmentOnBench, setEquipmentOnBench] = useState<Array<{
    id: string;
    position: { x: number; y: number };
    isActive: boolean;
  }>>([]);
  const [activeEquipment, setActiveEquipment] = useState<string>("");

  // Handle color transitions with animation
  const animateColorTransition = useCallback((fromColor: string, toColor: string, newState: EquilibriumState) => {
    setColorTransition({
      from: fromColor,
      to: toColor,
      duration: ANIMATION.COLOR_TRANSITION_DURATION,
      currentStep: 0,
      totalSteps: 20,
      isAnimating: true
    });

    // Animate the color transition
    let step = 0;
    const totalSteps = 20;
    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      
      // Interpolate between colors
      const r1 = parseInt(fromColor.slice(1, 3), 16);
      const g1 = parseInt(fromColor.slice(3, 5), 16);
      const b1 = parseInt(fromColor.slice(5, 7), 16);
      const r2 = parseInt(toColor.slice(1, 3), 16);
      const g2 = parseInt(toColor.slice(3, 5), 16);
      const b2 = parseInt(toColor.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      const currentColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      setTestTube(prev => ({ ...prev, colorHex: currentColor }));
      
      if (step >= totalSteps) {
        clearInterval(interval);
        setTestTube(prev => ({ ...prev, colorHex: toColor }));
        setEquilibriumState(newState);
        setColorTransition(null);
      }
    }, ANIMATION.COLOR_TRANSITION_DURATION / totalSteps);
  }, []);

  // Handle equipment drop on workbench
  const handleEquipmentDrop = useCallback((equipmentId: string, x: number, y: number) => {
    // Check if this equipment is required for current step
    const currentStepData = GUIDED_STEPS[currentStep - 1];
    if (!currentStepData.equipment.includes(equipmentId)) {
      setShowToast(`${equipmentId.replace('-', ' ')} is not needed for step ${currentStep}. Follow the current step instructions.`);
      setTimeout(() => setShowToast(""), 3000);
      return;
    }

    // Add equipment to workbench
    setEquipmentOnBench(prev => {
      const filtered = prev.filter(eq => eq.id !== equipmentId);
      return [...filtered, {
        id: equipmentId,
        position: { x, y },
        isActive: false
      }];
    });

    setShowToast(`${equipmentId.replace('-', ' ')} placed on workbench`);
    setTimeout(() => setShowToast(""), 2000);

    // Auto-complete step if it's just placing equipment
    if (currentStepData.action.includes("Drag") && !completedSteps.includes(currentStep)) {
      setTimeout(() => {
        handleStepComplete();
      }, 1000);
    }

    // Special handling for test tube - automatically add initial solution
    if (equipmentId === 'test-tube' && currentStep === 1) {
      setTimeout(() => {
        setTestTube(prev => ({
          ...prev,
          colorHex: COLORS.PINK,
          contents: ['CoCl₂', 'H₂O'],
          volume: 10
        }));
        setShowToast("Test tube now contains pink [Co(H₂O)₆]²⁺ solution");
        setTimeout(() => setShowToast(""), 3000);
      }, 1500);
    }
  }, [currentStep, completedSteps]);

  // Handle equipment interaction
  const handleEquipmentInteract = useCallback((equipmentId: string) => {
    const currentStepData = GUIDED_STEPS[currentStep - 1];
    
    if (equipmentId === 'concentrated-hcl' && currentStep === 4) {
      // Add HCl and change color to blue
      setActiveEquipment(equipmentId);
      setDropperAction({
        id: Date.now().toString(),
        reagentId: 'hcl',
        targetId: 'test-tube',
        amount: 2,
        timestamp: Date.now(),
        isAnimating: true
      });

      setShowToast("Adding HCl... Cl⁻ ions shifting equilibrium right!");

      setTimeout(() => {
        setDropperAction(null);
        animateColorTransition(testTube.colorHex, COLORS.BLUE, EQUILIBRIUM_STATES.chloride);
        setTestTube(prev => ({
          ...prev,
          contents: [...prev.contents, 'HCl'],
        }));
        
        const logEntry: ExperimentLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          action: 'Added HCl',
          reagent: 'Concentrated HCl',
          amount: 2,
          colorBefore: testTube.colorHex,
          colorAfter: COLORS.BLUE,
          observation: 'Solution changed from pink to blue - equilibrium shifted right',
          equilibriumShift: 'right'
        };
        setExperimentLog(prev => [...prev, logEntry]);
        
        setActiveEquipment("");
        setTimeout(() => setShowToast(""), 3000);
        handleStepComplete();
      }, ANIMATION.DROPPER_DURATION);

    } else if (equipmentId === 'distilled-water' && currentStep === 6) {
      // Add water and change color back to pink
      setActiveEquipment(equipmentId);
      setDropperAction({
        id: Date.now().toString(),
        reagentId: 'water',
        targetId: 'test-tube',
        amount: 5,
        timestamp: Date.now(),
        isAnimating: true
      });

      setShowToast("Adding water... Diluting Cl⁻ ions, shifting equilibrium left!");

      setTimeout(() => {
        setDropperAction(null);
        animateColorTransition(testTube.colorHex, COLORS.PINK, EQUILIBRIUM_STATES.hydrated);
        setTestTube(prev => ({
          ...prev,
          volume: prev.volume + 5,
        }));
        
        const logEntry: ExperimentLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          action: 'Added Water',
          reagent: 'Distilled Water',
          amount: 5,
          colorBefore: testTube.colorHex,
          colorAfter: COLORS.PINK,
          observation: 'Solution changed from blue to pink - equilibrium shifted left',
          equilibriumShift: 'left'
        };
        setExperimentLog(prev => [...prev, logEntry]);
        
        setActiveEquipment("");
        setTimeout(() => setShowToast(""), 3000);
        handleStepComplete();
      }, ANIMATION.DROPPER_DURATION);

    } else {
      setShowToast("Follow the current step instructions");
      setTimeout(() => setShowToast(""), 2000);
    }
  }, [currentStep, testTube.colorHex, animateColorTransition]);

  // Handle step completion
  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
      
      if (currentStep < GUIDED_STEPS.length) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setShowToast(`Step ${currentStep} completed! Moving to step ${currentStep + 1}`);
          setTimeout(() => setShowToast(""), 3000);
        }, 500);
      } else {
        setShowToast("Experiment completed! You can now experiment freely.");
        setTimeout(() => setShowToast(""), 4000);
      }
    }
  };

  // Reset experiment
  const handleResetExperiment = () => {
    setTestTube(INITIAL_TESTTUBE);
    setEquilibriumState(EQUILIBRIUM_STATES.hydrated);
    setColorTransition(null);
    setDropperAction(null);
    setExperimentLog([]);
    setCurrentStep(1);
    setCompletedSteps([]);
    setEquipmentOnBench([]);
    setActiveEquipment("");
    setShowToast("");
    onReset();
  };

  const currentStepData = GUIDED_STEPS[currentStep - 1];

  return (
    <TooltipProvider>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
        {/* Step Progress Bar */}
        <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Experiment Progress</h3>
            <span className="text-sm text-blue-600 font-medium">
              Step {currentStep} of {GUIDED_STEPS.length}
            </span>
          </div>
          
          {/* Progress indicators */}
          <div className="flex space-x-2 mb-4">
            {GUIDED_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  completedSteps.includes(step.id)
                    ? 'bg-green-500'
                    : currentStep === step.id
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Current step info */}
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              completedSteps.includes(currentStep) 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {completedSteps.includes(currentStep) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-bold">{currentStep}</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">
                {currentStepData.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {currentStepData.description}
              </p>
              {currentStep === 2 ? (
                <button
                  onClick={() => {
                    setShowToast("Pink [Co(H₂O)₆]²⁺ complex observed! Moving to next step...");
                    setTimeout(() => {
                      handleStepComplete();
                      setShowToast("");
                    }, 1500);
                  }}
                  className="inline-flex items-center px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 mr-1" />
                  {currentStepData.action}
                </button>
              ) : (
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  {currentStepData.action}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Equipment Section - Left */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                Equipment
              </h3>
              
              <div className="space-y-3">
                {LAB_EQUIPMENT.map((equipment) => (
                  <Equipment
                    key={equipment.id}
                    id={equipment.id}
                    name={equipment.name}
                    icon={equipment.icon}
                    disabled={!experimentStarted}
                  />
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> Drag equipment to the workbench following the step-by-step instructions.
                </p>
              </div>
            </div>

            {/* Equilibrium Equation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Chemical Equilibrium</h4>
              <div className="text-center text-sm font-mono">
                <span style={{ color: COLORS.PINK }}>[Co(H₂O)₆]²⁺</span>
                <span className="mx-2">+</span>
                <span>4Cl⁻</span>
                <span className="mx-3">⇌</span>
                <span style={{ color: COLORS.BLUE }}>[CoCl₄]²⁻</span>
                <span className="mx-2">+</span>
                <span>6H₂O</span>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">
                Pink hydrated ⇌ Blue chloride
              </div>
            </div>

            {/* Reset Button */}
            <Button
              onClick={handleResetExperiment}
              variant="outline"
              className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              Reset Experiment
            </Button>
          </div>

          {/* Workbench - Center */}
          <div className="lg:col-span-6">
            <WorkBench
              onDrop={handleEquipmentDrop}
              isRunning={isRunning}
              currentStep={currentStep}
            >
              {/* Positioned Equipment */}
              {equipmentOnBench.map((equipment) => {
                const equipmentData = LAB_EQUIPMENT.find(eq => eq.id === equipment.id);
                return equipmentData ? (
                  <Equipment
                    key={equipment.id}
                    id={equipment.id}
                    name={equipmentData.name}
                    icon={equipmentData.icon}
                    position={equipment.position}
                    onRemove={(id) => {
                      setEquipmentOnBench(prev => prev.filter(eq => eq.id !== id));
                      setShowToast(`${id.replace('-', ' ')} removed from workbench`);
                      setTimeout(() => setShowToast(""), 2000);
                    }}
                    onInteract={handleEquipmentInteract}
                    isActive={activeEquipment === equipment.id}
                    color={equipment.id === 'test-tube' ? testTube.colorHex : undefined}
                    volume={equipment.id === 'test-tube' ? (testTube.volume / 15) * 100 : undefined}
                  />
                ) : null;
              })}
            </WorkBench>
          </div>

          {/* Analysis Panel - Right */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-green-600" />
                Live Analysis
              </h3>

              {/* Current State */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Current State</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: equilibriumState.colorHex }}
                  ></div>
                  <span className="text-sm capitalize">{equilibriumState.dominantComplex}</span>
                </div>
                <p className="text-xs text-gray-600">{equilibriumState.explanation}</p>
              </div>

              {/* Steps Completed */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Completed Steps</h4>
                <div className="space-y-1">
                  {GUIDED_STEPS.map((step) => (
                    <div key={step.id} className={`flex items-center space-x-2 text-xs ${
                      completedSteps.includes(step.id) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Actions */}
              {experimentLog.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Recent Actions</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {experimentLog.slice(-3).reverse().map((log) => (
                      <div key={log.id} className="text-xs p-2 bg-gray-50 rounded">
                        <div className="font-medium">{log.action}</div>
                        <div className="text-gray-600">{log.observation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dropper Animation */}
        {dropperAction && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="animate-bounce bg-white rounded-lg p-4 shadow-xl border-2 border-blue-300">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto" />
              <p className="text-sm text-center mt-2">Adding solution...</p>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{showToast}</span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
