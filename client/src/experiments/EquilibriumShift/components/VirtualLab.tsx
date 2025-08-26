import React, { useState, useEffect, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FlaskConical, Beaker, Droplets, Info, ArrowRight, ArrowLeft } from "lucide-react";
import { 
  COLORS, 
  REAGENT_BOTTLES, 
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

  // Handle adding HCl
  const handleAddHCl = () => {
    if (!experimentStarted || dropperAction?.isAnimating) return;

    const currentColor = testTube.colorHex;
    let newState: EquilibriumState;
    let targetColor: string;

    // Determine the transition based on current state
    if (equilibriumState.dominantComplex === 'hydrated') {
      // Pink -> Purple (transition)
      newState = EQUILIBRIUM_STATES.transition;
      targetColor = COLORS.PURPLE;
    } else if (equilibriumState.dominantComplex === 'transition') {
      // Purple -> Blue
      newState = EQUILIBRIUM_STATES.chloride;
      targetColor = COLORS.BLUE;
    } else {
      // Already blue - intensify blue
      newState = EQUILIBRIUM_STATES.chloride;
      targetColor = COLORS.BLUE;
    }

    // Start dropper animation
    setDropperAction({
      id: Date.now().toString(),
      reagentId: 'hcl',
      targetId: 'main-tube',
      amount: 2,
      timestamp: Date.now(),
      isAnimating: true
    });

    // Show animation feedback
    setShowToast("Adding HCl... Cl⁻ ions shifting equilibrium right!");

    // Animate dropper for 1.5 seconds, then start color transition
    setTimeout(() => {
      setDropperAction(null);
      animateColorTransition(currentColor, targetColor, newState);
      
      // Log the action
      const logEntry: ExperimentLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        action: 'Added HCl',
        reagent: 'Concentrated HCl',
        amount: 2,
        colorBefore: currentColor,
        colorAfter: targetColor,
        observation: `Solution changing from ${equilibriumState.dominantComplex} to ${newState.dominantComplex}`,
        equilibriumShift: 'right'
      };
      setExperimentLog(prev => [...prev, logEntry]);
      
      setTimeout(() => setShowToast(""), 3000);
    }, ANIMATION.DROPPER_DURATION);
  };

  // Handle adding water
  const handleAddWater = () => {
    if (!experimentStarted || dropperAction?.isAnimating) return;

    const currentColor = testTube.colorHex;
    let newState: EquilibriumState;
    let targetColor: string;

    // Determine the transition based on current state
    if (equilibriumState.dominantComplex === 'chloride') {
      // Blue -> Purple (transition)
      newState = EQUILIBRIUM_STATES.transition;
      targetColor = COLORS.PURPLE;
    } else if (equilibriumState.dominantComplex === 'transition') {
      // Purple -> Pink
      newState = EQUILIBRIUM_STATES.hydrated;
      targetColor = COLORS.PINK;
    } else {
      // Already pink - maintain pink
      newState = EQUILIBRIUM_STATES.hydrated;
      targetColor = COLORS.PINK;
    }

    // Start dropper animation
    setDropperAction({
      id: Date.now().toString(),
      reagentId: 'water',
      targetId: 'main-tube',
      amount: 5,
      timestamp: Date.now(),
      isAnimating: true
    });

    // Show animation feedback
    setShowToast("Adding water... Diluting Cl⁻ ions, shifting equilibrium left!");

    // Animate dropper for 1.5 seconds, then start color transition
    setTimeout(() => {
      setDropperAction(null);
      animateColorTransition(currentColor, targetColor, newState);
      
      // Log the action
      const logEntry: ExperimentLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        action: 'Added Water',
        reagent: 'Distilled Water',
        amount: 5,
        colorBefore: currentColor,
        colorAfter: targetColor,
        observation: `Solution changing from ${equilibriumState.dominantComplex} to ${newState.dominantComplex}`,
        equilibriumShift: 'left'
      };
      setExperimentLog(prev => [...prev, logEntry]);
      
      setTimeout(() => setShowToast(""), 3000);
    }, ANIMATION.DROPPER_DURATION);
  };

  // Reset experiment
  const handleResetExperiment = () => {
    setTestTube(INITIAL_TESTTUBE);
    setEquilibriumState(EQUILIBRIUM_STATES.hydrated);
    setColorTransition(null);
    setDropperAction(null);
    setExperimentLog([]);
    setShowToast("");
    onReset();
  };

  // Get current guided step instruction
  const getCurrentInstruction = () => {
    if (mode.current === 'guided' && mode.currentGuidedStep !== undefined) {
      return GUIDED_STEPS[mode.currentGuidedStep] || GUIDED_STEPS[0];
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
        {/* Guided Mode Instructions */}
        {mode.current === 'guided' && (
          <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Step {(mode.currentGuidedStep || 0) + 1}</h4>
                  <p className="text-sm text-gray-600">{getCurrentInstruction()}</p>
                </div>
              </div>
              {(mode.currentGuidedStep || 0) > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onStepComplete}
                  className="flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Lab Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Reagent Bottles - Left */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Beaker className="w-5 h-5 mr-2 text-blue-600" />
              Reagents
            </h3>
            
            {REAGENT_BOTTLES.map((reagent) => (
              <div key={reagent.id} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={reagent.id === 'hcl' ? handleAddHCl : handleAddWater}
                      disabled={!experimentStarted || dropperAction?.isAnimating}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                        !experimentStarted || dropperAction?.isAnimating
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          : 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-lg cursor-pointer'
                      }`}
                    >
                      <div className="text-center">
                        <div 
                          className="w-16 h-20 mx-auto mb-3 rounded-lg border-2 border-gray-300 relative overflow-hidden"
                          style={{ backgroundColor: reagent.color }}
                        >
                          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-current to-transparent opacity-60"></div>
                          <FlaskConical className="w-8 h-8 absolute top-1 left-1/2 transform -translate-x-1/2 text-gray-600 opacity-50" />
                        </div>
                        <h4 className="font-semibold text-sm text-gray-800">{reagent.name}</h4>
                        <p className="text-xs text-gray-600">{reagent.formula}</p>
                        <p className="text-xs text-blue-600 mt-1">{reagent.concentration}</p>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{reagent.description}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Dropper Animation */}
                {dropperAction?.reagentId === reagent.id && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                      <Droplets className="w-6 h-6 text-blue-500" />
                      <div className="flex space-x-1 mt-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Reset Button */}
            <Button
              onClick={handleResetExperiment}
              variant="outline"
              className="w-full mt-6 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              Reset Experiment
            </Button>
          </div>

          {/* Test Tube Area - Center */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center relative">
            <div className="relative">
              {/* Test Tube */}
              <div className="w-24 h-64 bg-gray-200 rounded-t-full rounded-b-lg border-4 border-gray-400 relative overflow-hidden shadow-xl">
                {/* Solution */}
                <div 
                  className="absolute bottom-0 left-0 right-0 transition-all duration-300 rounded-b-lg"
                  style={{ 
                    height: '85%', 
                    backgroundColor: testTube.colorHex,
                    boxShadow: `inset 0 0 20px rgba(0,0,0,0.1)`
                  }}
                >
                  {/* Bubbling effect during transitions */}
                  {colorTransition?.isAnimating && (
                    <div className="absolute inset-0">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-ping"
                          style={{
                            left: `${20 + (i % 4) * 15}%`,
                            bottom: `${10 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '1s'
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Test tube rim */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gray-300 border-b-2 border-gray-400"></div>
              </div>

              {/* Test Tube Label */}
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-gray-700">Main Reaction Vessel</p>
                <p className="text-xs text-gray-500">Volume: {testTube.volume} mL</p>
                <p className="text-xs text-gray-500">Temperature: {testTube.temperature}°C</p>
              </div>
            </div>

            {/* Equilibrium Equation */}
            <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">Chemical Equilibrium</h4>
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
          </div>

          {/* Dynamic Explanation Panel - Right */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-green-600" />
              Live Analysis
            </h3>

            {/* Current State */}
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
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

            {/* Equilibrium Direction */}
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Equilibrium Direction</h4>
              <div className="flex items-center justify-center space-x-2">
                <ArrowLeft 
                  className={`w-6 h-6 ${
                    equilibriumState.equilibriumDirection === 'left' 
                      ? 'text-pink-500' 
                      : 'text-gray-300'
                  }`} 
                />
                <span className="text-xs">⇌</span>
                <ArrowRight 
                  className={`w-6 h-6 ${
                    equilibriumState.equilibriumDirection === 'right' 
                      ? 'text-blue-500' 
                      : 'text-gray-300'
                  }`} 
                />
              </div>
              <p className="text-xs text-center text-gray-600 mt-2">
                {equilibriumState.equilibriumDirection === 'left' && 'Favoring hydrated complex'}
                {equilibriumState.equilibriumDirection === 'right' && 'Favoring chloride complex'}
                {equilibriumState.equilibriumDirection === 'neutral' && 'Equilibrium shifting'}
              </p>
            </div>

            {/* Recent Actions Log */}
            {experimentLog.length > 0 && (
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
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
