import React, { useState, useEffect, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FlaskConical, Beaker, Droplets, Info, ArrowRight, CheckCircle, Wrench, X, TrendingUp, Clock, Home, Undo } from "lucide-react";
import { Link } from "wouter";
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
  onStepComplete: (stepId?: number) => void;
  onReset: () => void;
  completedSteps: number[];
}

export default function VirtualLab({
  experimentStarted,
  onStartExperiment,
  isRunning,
  setIsRunning,
  mode,
  onStepComplete,
  onReset,
  completedSteps,
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
  const [equipmentOnBench, setEquipmentOnBench] = useState<Array<{
    id: string;
    position: { x: number; y: number };
    isActive: boolean;
  }>>([]);
  const [activeEquipment, setActiveEquipment] = useState<string>("");
  const [hclClickCount, setHclClickCount] = useState<number>(0);
  const [waterClickCount, setWaterClickCount] = useState<number>(0);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
  const [experimentCompleted, setExperimentCompleted] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<{type: string, equipmentId?: string, data?: any} | null>(null);
  const [stepHistory, setStepHistory] = useState<{step: number, state: any}[]>([]);
  const [showAddingSolutions, setShowAddingSolutions] = useState(false);

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

    // Store the previous state for undo
    const previousState = equipmentOnBench.find(eq => eq.id === equipmentId);

    // Add equipment to workbench
    setEquipmentOnBench(prev => {
      const filtered = prev.filter(eq => eq.id !== equipmentId);
      return [...filtered, {
        id: equipmentId,
        position: { x, y },
        isActive: false
      }];
    });

    // Track this action for undo
    setLastAction({
      type: 'equipment_placed',
      equipmentId,
      data: { previousState, newPosition: { x, y } }
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
      // Two-step HCl addition: 1st click -> purple, 2nd click -> blue
      setActiveEquipment(equipmentId);
      setDropperAction({
        id: Date.now().toString(),
        reagentId: 'hcl',
        targetId: 'test-tube',
        amount: 1,
        timestamp: Date.now(),
        isAnimating: true
      });

      const newClickCount = hclClickCount + 1;
      setHclClickCount(newClickCount);

      if (newClickCount === 1) {
        // First click: pink -> purple
        setShowToast("Adding HCl... Equilibrium starting to shift!");
        setShowAddingSolutions(true);

        setTimeout(() => {
          setDropperAction(null);
          setShowAddingSolutions(false);
          animateColorTransition(testTube.colorHex, COLORS.PURPLE, EQUILIBRIUM_STATES.transition);
          setTestTube(prev => ({
            ...prev,
            contents: [...prev.contents, 'HCl'],
          }));

          const logEntry: ExperimentLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            action: 'Added HCl (1st time)',
            reagent: 'Concentrated HCl',
            amount: 1,
            colorBefore: testTube.colorHex,
            colorAfter: COLORS.PURPLE,
            observation: 'Solution changing from pink to purple - equilibrium shifting',
            equilibriumShift: 'right'
          };
          setExperimentLog(prev => [...prev, logEntry]);

          // Track this action for undo
          setLastAction({
            type: 'reagent_added',
            equipmentId: 'concentrated-hcl',
            data: {
              clickCount: newClickCount - 1,
              previousColor: testTube.colorHex,
              previousState: equilibriumState
            }
          });

          setActiveEquipment("");
          setShowToast("Purple color! Click HCl again to complete the shift.");
          setTimeout(() => setShowToast(""), 3000);
        }, ANIMATION.DROPPER_DURATION);

      } else if (newClickCount === 2) {
        // Second click: purple -> blue
        setShowToast("Adding more HCl... Completing equilibrium shift!");

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
            action: 'Added HCl (2nd time)',
            reagent: 'Concentrated HCl',
            amount: 1,
            colorBefore: testTube.colorHex,
            colorAfter: COLORS.BLUE,
            observation: 'Solution changed from purple to blue - equilibrium fully shifted right',
            equilibriumShift: 'right'
          };
          setExperimentLog(prev => [...prev, logEntry]);

          // Track this action for undo
          setLastAction({
            type: 'reagent_added',
            equipmentId: 'concentrated-hcl',
            data: {
              clickCount: newClickCount - 1,
              previousColor: testTube.colorHex,
              previousState: equilibriumState
            }
          });

          setActiveEquipment("");
          setTimeout(() => setShowToast(""), 3000);
          handleStepComplete();
        }, ANIMATION.DROPPER_DURATION);
      }

    } else if (equipmentId === 'distilled-water' && currentStep === 6) {
      // Two-step water addition: 1st click -> purple, 2nd click -> pink
      setActiveEquipment(equipmentId);
      setDropperAction({
        id: Date.now().toString(),
        reagentId: 'water',
        targetId: 'test-tube',
        amount: 3,
        timestamp: Date.now(),
        isAnimating: true
      });

      const newWaterClickCount = waterClickCount + 1;
      setWaterClickCount(newWaterClickCount);

      if (newWaterClickCount === 1) {
        // First click: blue -> purple
        setShowToast("Adding water... Equilibrium starting to shift back!");

        setTimeout(() => {
          setDropperAction(null);
          animateColorTransition(testTube.colorHex, COLORS.PURPLE, EQUILIBRIUM_STATES.transition);
          setTestTube(prev => ({
            ...prev,
            volume: prev.volume + 3,
          }));

          const logEntry: ExperimentLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            action: 'Added Water (1st time)',
            reagent: 'Distilled Water',
            amount: 3,
            colorBefore: testTube.colorHex,
            colorAfter: COLORS.PURPLE,
            observation: 'Solution changing from blue to purple - equilibrium shifting back',
            equilibriumShift: 'left'
          };
          setExperimentLog(prev => [...prev, logEntry]);

          setActiveEquipment("");
          setShowToast("Purple color! Click water again to complete the reverse shift.");
          setTimeout(() => setShowToast(""), 3000);
        }, ANIMATION.DROPPER_DURATION);

      } else if (newWaterClickCount === 2) {
        // Second click: purple -> pink
        setShowToast("Adding more water... Completing reverse equilibrium shift!");

        setTimeout(() => {
          setDropperAction(null);
          animateColorTransition(testTube.colorHex, COLORS.PINK, EQUILIBRIUM_STATES.hydrated);
          setTestTube(prev => ({
            ...prev,
            volume: prev.volume + 3,
          }));

          const logEntry: ExperimentLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            action: 'Added Water (2nd time)',
            reagent: 'Distilled Water',
            amount: 3,
            colorBefore: testTube.colorHex,
            colorAfter: COLORS.PINK,
            observation: 'Solution changed from purple to pink - equilibrium fully shifted left',
            equilibriumShift: 'left'
          };
          setExperimentLog(prev => [...prev, logEntry]);

          setActiveEquipment("");
          setTimeout(() => setShowToast(""), 3000);
          handleStepComplete();
        }, ANIMATION.DROPPER_DURATION);
      }

    } else {
      setShowToast("Follow the current step instructions");
      setTimeout(() => setShowToast(""), 2000);
    }
  }, [currentStep, testTube.colorHex, animateColorTransition]);

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (!lastAction) return;

    if (lastAction.type === 'equipment_placed') {
      const { equipmentId, data } = lastAction;

      if (data.previousState) {
        // Restore to previous position
        setEquipmentOnBench(prev =>
          prev.map(eq => eq.id === equipmentId ? data.previousState : eq)
        );
      } else {
        // Remove equipment if it wasn't previously on the bench
        setEquipmentOnBench(prev => prev.filter(eq => eq.id !== equipmentId));
      }

      setShowToast(`Undid: ${equipmentId?.replace('-', ' ')} placement`);
      setTimeout(() => setShowToast(""), 2000);

      // Clear the last action
      setLastAction(null);
    }
  }, [lastAction]);

  // Handle step undo - go back to previous step
  const handleStepUndo = useCallback(() => {
    if (stepHistory.length > 0 && currentStep > 1) {
      const lastState = stepHistory[stepHistory.length - 1];

      // Restore previous state
      setTestTube(lastState.state.testTube);
      setEquilibriumState(lastState.state.equilibriumState);
      setExperimentLog(lastState.state.experimentLog);
      setEquipmentOnBench(lastState.state.equipmentOnBench);
      setHclClickCount(lastState.state.hclClickCount);
      setWaterClickCount(lastState.state.waterClickCount);

      // Go back to previous step
      setCurrentStep(currentStep - 1);

      // Remove the last state from history
      setStepHistory(prev => prev.slice(0, -1));

      setShowToast(`Undid step ${currentStep}. Returned to step ${currentStep - 1}`);
      setTimeout(() => setShowToast(""), 3000);
    }
  }, [stepHistory, currentStep]);

  // Handle step completion
  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      // Save current state to history before completing step
      const currentState = {
        testTube: { ...testTube },
        equilibriumState: { ...equilibriumState },
        experimentLog: [...experimentLog],
        equipmentOnBench: [...equipmentOnBench],
        hclClickCount,
        waterClickCount
      };
      setStepHistory(prev => [...prev, { step: currentStep, state: currentState }]);

      // Call parent's step completion handler
      onStepComplete(currentStep);

      if (currentStep < GUIDED_STEPS.length) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setShowToast(`Step ${currentStep} completed! Moving to step ${currentStep + 1}`);
          setTimeout(() => setShowToast(""), 3000);
        }, 500);
      } else {
        setExperimentCompleted(true);
        setShowToast("Experiment completed! Click 'View Results' for detailed analysis.");
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
    setEquipmentOnBench([]);
    setActiveEquipment("");
    setHclClickCount(0);
    setWaterClickCount(0);
    setShowResultsModal(false);
    setExperimentCompleted(false);
    setLastAction(null);
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

            {/* Equilibrium Equation - Made wider */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Chemical Equilibrium</h4>
              <div className="text-center text-xs font-mono leading-relaxed bg-gray-50 rounded-lg p-3 border">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  <span style={{ color: COLORS.PINK }} className="font-bold">[Co(H₂O)₆]²⁺</span>
                  <span className="mx-1">+</span>
                  <span className="font-bold">4Cl⁻</span>
                  <span className="mx-2 text-lg">⇌</span>
                  <span style={{ color: COLORS.BLUE }} className="font-bold">[CoCl₄]²⁻</span>
                  <span className="mx-1">+</span>
                  <span className="font-bold">6H₂O</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                Pink hydrated ⇌ Blue chloride
              </div>
            </div>

            {/* Undo Button - Only show when equipment is on workbench */}
            {equipmentOnBench.length > 0 && lastAction && (
              <Button
                onClick={handleUndo}
                variant="outline"
                className="w-full bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 flex items-center justify-center space-x-2"
              >
                <Undo className="w-4 h-4" />
                <span>Undo Last Action</span>
              </Button>
            )}

            {/* Results Button - Only show when experiment is completed */}
            {experimentCompleted && (
              <Button
                onClick={() => setShowResultsModal(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                📊 View Results & Analysis
              </Button>
            )}

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
                    volume={equipment.id === 'test-tube' ? Math.min(100, (testTube.volume / 15) * 100) : undefined}
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

        {/* Results Analysis Modal */}
        <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Experiment Results & Analysis
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Complete analysis of your Equilibrium Shift experiment with [Co(H₂O)₆]²⁺ vs Cl⁻ Ions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Experiment Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
                  Experiment Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{completedSteps.length}</div>
                    <div className="text-sm text-gray-600">Steps Completed</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{experimentLog.length}</div>
                    <div className="text-sm text-gray-600">Actions Performed</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(testTube.volume)}mL</div>
                    <div className="text-sm text-gray-600">Final Volume</div>
                  </div>
                </div>
              </div>

              {/* Chemical Equilibrium Analysis */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Chemical Equilibrium Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Equilibrium Equation</h4>
                    <div className="text-center text-lg font-mono bg-white rounded p-3 border">
                      <span style={{ color: COLORS.PINK }} className="font-bold">[Co(H₂O)₆]²⁺</span>
                      <span className="mx-3">+</span>
                      <span className="font-bold">4Cl⁻</span>
                      <span className="mx-4 text-xl">⇌</span>
                      <span style={{ color: COLORS.BLUE }} className="font-bold">[CoCl₄]²⁻</span>
                      <span className="mx-3">+</span>
                      <span className="font-bold">6H₂O</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <h4 className="font-semibold text-pink-800 mb-2">Hydrated Complex [Co(H₂O)₆]²⁺</h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• Pink color</li>
                        <li>• Octahedral geometry</li>
                        <li>• Favored by excess H₂O</li>
                        <li>• Low Cl⁻ concentration</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Chloride Complex [CoCl₄]²⁻</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Blue color</li>
                        <li>• Tetrahedral geometry</li>
                        <li>• Favored by excess Cl⁻</li>
                        <li>• High Cl⁻ concentration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Timeline */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Action Timeline
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {experimentLog.map((log, index) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{log.action}</div>
                        <div className="text-sm text-gray-600">{log.observation}</div>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: log.colorBefore }}></span>
                            Before: {log.colorBefore}
                          </span>
                          <span>→</span>
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: log.colorAfter }}></span>
                            After: {log.colorAfter}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Le Chatelier's Principle Demonstration */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Le Chatelier's Principle Demonstrated</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Adding HCl (Stress: ↑ Cl⁻ concentration)</h4>
                    <p className="text-sm text-gray-700">
                      The system responds by shifting right to consume excess Cl⁻ ions, forming more [CoCl₄]²⁻ complex (blue color).
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-pink-800 mb-2">Adding Water (Stress: ↓ Cl⁻ concentration)</h4>
                    <p className="text-sm text-gray-700">
                      The system responds by shifting left to counteract the dilution, forming more [Co(H₂O)₆]²⁺ complex (pink color).
                    </p>
                  </div>
                </div>
              </div>

              {/* Final State */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Experimental State</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Current Solution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: equilibriumState.colorHex }}
                        ></div>
                        <span className="text-sm font-medium capitalize">{equilibriumState.dominantComplex} Complex</span>
                      </div>
                      <p className="text-sm text-gray-600">{equilibriumState.explanation}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Contents Analysis</h4>
                    <div className="space-y-1">
                      <div className="text-sm">Volume: <span className="font-medium">{Math.round(testTube.volume)} mL</span></div>
                      <div className="text-sm">Components: <span className="font-medium">{testTube.contents.join(', ')}</span></div>
                      <div className="text-sm">Color: <span className="font-medium">{testTube.color}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Link href="/">
                <Button className="bg-gray-500 hover:bg-gray-600 text-white flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Return to Experiments</span>
                </Button>
              </Link>
              <Button
                onClick={() => setShowResultsModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Close Analysis
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
