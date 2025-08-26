import React, { useState, useEffect, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FlaskConical, Beaker, Droplets, TestTube, BarChart3, Info, ArrowRight } from "lucide-react";
import { 
  SOLUTIONS, 
  PART_A_TUBES, 
  PART_B_TUBES, 
  calculateColorIntensity, 
  intensityToColor, 
  EXPERIMENT_STEPS,
  ANIMATION,
  EQUILIBRIUM_EQUATION 
} from "../constants";
import { 
  TestTubeState, 
  PipetteAction, 
  ExperimentPhase, 
  ExperimentLog,
  ColorimetryData 
} from "../types";

interface VirtualLabProps {
  experimentStarted: boolean;
  onStartExperiment: () => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  currentStep: number;
  onStepComplete: () => void;
  phase: ExperimentPhase;
  onPhaseComplete: (phase: 'part-a' | 'part-b') => void;
  showAnalysis: boolean;
  onReset: () => void;
}

export default function VirtualLab({
  experimentStarted,
  onStartExperiment,
  isRunning,
  setIsRunning,
  currentStep,
  onStepComplete,
  phase,
  onPhaseComplete,
  showAnalysis,
  onReset,
}: VirtualLabProps) {
  // Lab state
  const [testTubes, setTestTubes] = useState<TestTubeState[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<string>("");
  const [pipetteAction, setPipetteAction] = useState<PipetteAction | null>(null);
  const [experimentLog, setExperimentLog] = useState<ExperimentLog[]>([]);
  const [showToast, setShowToast] = useState<string>("");
  const [selectedTube, setSelectedTube] = useState<string>("");
  const [volumeToAdd, setVolumeToAdd] = useState<number>(0);
  const [colorimetryData, setColorimetryData] = useState<ColorimetryData[]>([]);

  // Initialize test tubes when experiment starts
  useEffect(() => {
    if (experimentStarted && testTubes.length === 0) {
      const initialTubes: TestTubeState[] = [
        ...PART_A_TUBES.map(tube => ({
          ...tube,
          colorIntensity: calculateColorIntensity(tube.feVolume, tube.scnVolume),
          colorHex: intensityToColor(calculateColorIntensity(tube.feVolume, tube.scnVolume)),
          isCompleted: false
        })),
        ...PART_B_TUBES.map(tube => ({
          ...tube,
          colorIntensity: calculateColorIntensity(tube.feVolume, tube.scnVolume),
          colorHex: intensityToColor(calculateColorIntensity(tube.feVolume, tube.scnVolume)),
          isCompleted: false
        }))
      ];
      setTestTubes(initialTubes);
    }
  }, [experimentStarted, testTubes.length]);

  // Handle solution selection
  const handleSolutionSelect = (solutionId: string) => {
    setSelectedSolution(selectedSolution === solutionId ? "" : solutionId);
    setSelectedTube("");
    setVolumeToAdd(0);
  };

  // Handle test tube selection
  const handleTubeSelect = (tubeId: string) => {
    if (!selectedSolution) {
      setShowToast("Please select a solution first!");
      setTimeout(() => setShowToast(""), 2000);
      return;
    }
    setSelectedTube(tubeId);
    
    // Determine appropriate volume based on current step and tube
    const tube = testTubes.find(t => t.id === tubeId);
    if (!tube) return;

    if (selectedSolution === 'fe-nitrate') {
      if (tubeId.startsWith('t1') || tubeId.startsWith('t2') || tubeId.startsWith('t3') || 
          tubeId.startsWith('t4') || tubeId.startsWith('t5') || tubeId.startsWith('t6')) {
        setVolumeToAdd(5.0); // Part A: constant Fe³⁺
      } else {
        // Part B: variable Fe³⁺
        const volumes = [0.5, 1.0, 2.0, 3.0, 4.0, 5.0];
        const tubeIndex = parseInt(tubeId.slice(1)) - 7; // T7=0, T8=1, etc.
        setVolumeToAdd(volumes[tubeIndex] || 1.0);
      }
    } else if (selectedSolution === 'potassium-thiocyanate') {
      if (tubeId.startsWith('t1') || tubeId.startsWith('t2') || tubeId.startsWith('t3') || 
          tubeId.startsWith('t4') || tubeId.startsWith('t5') || tubeId.startsWith('t6')) {
        // Part A: variable SCN⁻
        const volumes = [0.0, 0.5, 1.0, 2.0, 3.0, 4.0];
        const tubeIndex = parseInt(tubeId.slice(1)) - 1; // T1=0, T2=1, etc.
        setVolumeToAdd(volumes[tubeIndex] || 0.0);
      } else {
        setVolumeToAdd(1.0); // Part B: constant SCN⁻
      }
    } else if (selectedSolution === 'nitric-acid') {
      // Calculate HNO₃ volume needed to reach 10.0 mL total
      const currentVolume = tube.feVolume + tube.scnVolume;
      setVolumeToAdd(Math.max(0, 10.0 - currentVolume));
    }
  };

  // Handle solution addition
  const handleAddSolution = () => {
    if (!selectedSolution || !selectedTube || volumeToAdd <= 0) return;

    const tube = testTubes.find(t => t.id === selectedTube);
    if (!tube) return;

    // Start pipette animation
    setPipetteAction({
      id: Date.now().toString(),
      solutionId: selectedSolution,
      targetTubeId: selectedTube,
      volume: volumeToAdd,
      timestamp: Date.now(),
      isAnimating: true
    });

    const solution = SOLUTIONS.find(s => s.id === selectedSolution);
    setShowToast(`Adding ${volumeToAdd} mL of ${solution?.name} to ${tube.label}...`);

    // Complete the addition after animation
    setTimeout(() => {
      setPipetteAction(null);
      
      setTestTubes(prev => prev.map(t => {
        if (t.id === selectedTube) {
          let updatedTube = { ...t };
          
          // Update volumes based on solution type
          if (selectedSolution === 'fe-nitrate') {
            updatedTube.feVolume = volumeToAdd;
          } else if (selectedSolution === 'potassium-thiocyanate') {
            updatedTube.scnVolume = volumeToAdd;
          } else if (selectedSolution === 'nitric-acid') {
            updatedTube.hno3Volume = volumeToAdd;
            updatedTube.totalVolume = 10.0; // Should now be complete
            updatedTube.isCompleted = true;
          }
          
          // Recalculate color
          updatedTube.colorIntensity = calculateColorIntensity(updatedTube.feVolume, updatedTube.scnVolume);
          updatedTube.colorHex = intensityToColor(updatedTube.colorIntensity);
          
          return updatedTube;
        }
        return t;
      }));

      // Log the action
      const logEntry: ExperimentLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        action: `Added ${solution?.name}`,
        tubeId: selectedTube,
        solution: solution?.name || '',
        volume: volumeToAdd,
        colorBefore: tube.colorHex,
        colorAfter: intensityToColor(calculateColorIntensity(
          selectedSolution === 'fe-nitrate' ? volumeToAdd : tube.feVolume,
          selectedSolution === 'potassium-thiocyanate' ? volumeToAdd : tube.scnVolume
        )),
        observation: `Color intensity: ${calculateColorIntensity(
          selectedSolution === 'fe-nitrate' ? volumeToAdd : tube.feVolume,
          selectedSolution === 'potassium-thiocyanate' ? volumeToAdd : tube.scnVolume
        )}%`
      };
      setExperimentLog(prev => [...prev, logEntry]);

      setSelectedSolution("");
      setSelectedTube("");
      setVolumeToAdd(0);
      setTimeout(() => setShowToast(""), 2000);
    }, ANIMATION.PIPETTE_DURATION);
  };

  // Generate colorimetry data for analysis
  const generateColorimetryData = useCallback(() => {
    const data: ColorimetryData[] = testTubes
      .filter(tube => tube.isCompleted)
      .map(tube => ({
        tubeId: tube.id,
        wavelength: 447, // nm - typical for [FeSCN]²⁺
        absorbance: tube.colorIntensity / 100 * 2, // Scaled absorbance
        transmittance: 100 - tube.colorIntensity,
        concentration: (tube.colorIntensity / 100) * 0.001 // Estimated [FeSCN]²⁺ in M
      }));
    
    setColorimetryData(data);
  }, [testTubes]);

  // Auto-generate colorimetry data when tubes are completed
  useEffect(() => {
    if (showAnalysis) {
      generateColorimetryData();
    }
  }, [showAnalysis, generateColorimetryData]);

  // Reset experiment
  const handleResetExperiment = () => {
    setTestTubes([]);
    setSelectedSolution("");
    setSelectedTube("");
    setVolumeToAdd(0);
    setPipetteAction(null);
    setExperimentLog([]);
    setColorimetryData([]);
    setShowToast("");
    onReset();
  };

  // Check if current phase is completed
  const checkPhaseCompletion = () => {
    if (phase.current === 'part-a') {
      const partATubes = testTubes.filter(t => t.id.startsWith('t') && parseInt(t.id.slice(1)) <= 6);
      return partATubes.length === 6 && partATubes.every(t => t.isCompleted);
    } else if (phase.current === 'part-b') {
      const partBTubes = testTubes.filter(t => t.id.startsWith('t') && parseInt(t.id.slice(1)) >= 7);
      return partBTubes.length === 6 && partBTubes.every(t => t.isCompleted);
    }
    return false;
  };

  // Handle phase completion
  useEffect(() => {
    if (checkPhaseCompletion()) {
      if (phase.current === 'part-a' && !phase.partACompleted) {
        setShowToast("Part A completed! Moving to Part B...");
        setTimeout(() => {
          onPhaseComplete('part-a');
          setShowToast("");
        }, 2000);
      } else if (phase.current === 'part-b' && !phase.partBCompleted) {
        setShowToast("Part B completed! Ready for analysis...");
        setTimeout(() => {
          onPhaseComplete('part-b');
          setShowToast("");
        }, 2000);
      }
    }
  }, [testTubes, phase, onPhaseComplete]);

  return (
    <TooltipProvider>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 p-6">
        {/* Current Step Instructions */}
        <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Info className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {EXPERIMENT_STEPS[currentStep]?.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {EXPERIMENT_STEPS[currentStep]?.description}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onStepComplete}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Lab Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Solutions Panel - Left */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Beaker className="w-5 h-5 mr-2 text-red-600" />
              Solutions
            </h3>
            
            {SOLUTIONS.map((solution) => (
              <div key={solution.id} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleSolutionSelect(solution.id)}
                      disabled={!experimentStarted}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedSolution === solution.id
                          ? 'border-red-400 bg-red-50 shadow-lg scale-105'
                          : !experimentStarted
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      <div className="text-center">
                        <div 
                          className="w-16 h-20 mx-auto mb-3 rounded-lg border-2 border-gray-300 relative overflow-hidden"
                          style={{ backgroundColor: solution.color }}
                        >
                          <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-current to-transparent opacity-40"></div>
                          <FlaskConical className="w-8 h-8 absolute top-1 left-1/2 transform -translate-x-1/2 text-gray-600 opacity-50" />
                        </div>
                        <h4 className="font-semibold text-sm text-gray-800">{solution.name}</h4>
                        <p className="text-xs text-gray-600">{solution.formula}</p>
                        <p className="text-xs text-red-600 mt-1 font-medium">{solution.concentration}</p>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{solution.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}

            {/* Pipette Animation */}
            {pipetteAction && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="animate-bounce bg-white rounded-lg p-4 shadow-xl border-2 border-blue-300">
                  <Droplets className="w-8 h-8 text-blue-500 mx-auto" />
                  <p className="text-sm text-center mt-2">Adding solution...</p>
                </div>
              </div>
            )}

            {/* Volume Input */}
            {selectedTube && selectedSolution && (
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-sm mb-2">Volume to Add</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={volumeToAdd}
                    onChange={(e) => setVolumeToAdd(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0"
                    max="10"
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-sm text-gray-600">mL</span>
                  <Button
                    onClick={handleAddSolution}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={volumeToAdd <= 0}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Test Tube Racks - Center */}
          <div className="lg:col-span-6 space-y-6">
            {/* Equilibrium Equation */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Chemical Equilibrium</h4>
              <div className="text-lg font-mono">
                <span className="text-blue-600">Fe³⁺</span>
                <span className="mx-2">+</span>
                <span className="text-green-600">SCN⁻</span>
                <span className="mx-3">⇌</span>
                <span className="text-red-600">[FeSCN]²⁺</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {EQUILIBRIUM_EQUATION.description}
              </p>
            </div>

            {/* Part A: Test Tubes T1-T6 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TestTube className="w-4 h-4 mr-2 text-red-600" />
                Part A: Variable [SCN⁻], Constant [Fe³⁺] = 5.00 mL
              </h4>
              <div className="grid grid-cols-6 gap-4">
                {testTubes.filter(tube => tube.id.startsWith('t') && parseInt(tube.id.slice(1)) <= 6).map((tube) => (
                  <div key={tube.id} className="text-center">
                    <button
                      onClick={() => handleTubeSelect(tube.id)}
                      disabled={!experimentStarted || !selectedSolution}
                      className={`w-full h-32 rounded-lg border-4 transition-all duration-300 relative overflow-hidden ${
                        selectedTube === tube.id
                          ? 'border-blue-400 shadow-lg scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${!experimentStarted || !selectedSolution ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {/* Test tube solution */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                        style={{ 
                          height: `${Math.max(20, (tube.feVolume + tube.scnVolume + tube.hno3Volume) * 8)}%`,
                          backgroundColor: tube.colorHex,
                          boxShadow: tube.colorIntensity > 0 ? `inset 0 0 10px rgba(0,0,0,0.2)` : 'none'
                        }}
                      >
                        {/* Mixing animation for high intensity */}
                        {tube.colorIntensity > 50 && (
                          <div className="absolute inset-0 opacity-30">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                                style={{
                                  left: `${30 + i * 20}%`,
                                  bottom: `${20 + Math.random() * 40}%`,
                                  animationDelay: `${i * 0.5}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Tube completion indicator */}
                      {tube.isCompleted && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                    <div className="mt-2">
                      <p className="font-semibold text-sm">{tube.label}</p>
                      <p className="text-xs text-gray-600">SCN⁻: {tube.scnVolume} mL</p>
                      <p className="text-xs text-red-600">Intensity: {tube.colorIntensity}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part B: Test Tubes T7-T12 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TestTube className="w-4 h-4 mr-2 text-red-600" />
                Part B: Variable [Fe³⁺], Constant [SCN⁻] = 1.00 mL
              </h4>
              <div className="grid grid-cols-6 gap-4">
                {testTubes.filter(tube => tube.id.startsWith('t') && parseInt(tube.id.slice(1)) >= 7).map((tube) => (
                  <div key={tube.id} className="text-center">
                    <button
                      onClick={() => handleTubeSelect(tube.id)}
                      disabled={!experimentStarted || !selectedSolution}
                      className={`w-full h-32 rounded-lg border-4 transition-all duration-300 relative overflow-hidden ${
                        selectedTube === tube.id
                          ? 'border-blue-400 shadow-lg scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${!experimentStarted || !selectedSolution ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {/* Test tube solution */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                        style={{ 
                          height: `${Math.max(20, (tube.feVolume + tube.scnVolume + tube.hno3Volume) * 8)}%`,
                          backgroundColor: tube.colorHex,
                          boxShadow: tube.colorIntensity > 0 ? `inset 0 0 10px rgba(0,0,0,0.2)` : 'none'
                        }}
                      >
                        {/* Mixing animation for high intensity */}
                        {tube.colorIntensity > 50 && (
                          <div className="absolute inset-0 opacity-30">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                                style={{
                                  left: `${30 + i * 20}%`,
                                  bottom: `${20 + Math.random() * 40}%`,
                                  animationDelay: `${i * 0.5}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Tube completion indicator */}
                      {tube.isCompleted && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                    <div className="mt-2">
                      <p className="font-semibold text-sm">{tube.label}</p>
                      <p className="text-xs text-gray-600">Fe³⁺: {tube.feVolume} mL</p>
                      <p className="text-xs text-red-600">Intensity: {tube.colorIntensity}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Panel - Right */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Analysis
            </h3>

            {/* Phase Progress */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Experiment Progress</h4>
              <div className="space-y-2">
                <div className={`flex items-center space-x-2 ${phase.partACompleted ? 'text-green-600' : phase.current === 'part-a' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${phase.partACompleted ? 'bg-green-500' : phase.current === 'part-a' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Part A: [SCN⁻] variation</span>
                </div>
                <div className={`flex items-center space-x-2 ${phase.partBCompleted ? 'text-green-600' : phase.current === 'part-b' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${phase.partBCompleted ? 'bg-green-500' : phase.current === 'part-b' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Part B: [Fe³⁺] variation</span>
                </div>
                <div className={`flex items-center space-x-2 ${phase.current === 'analysis' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${phase.current === 'analysis' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Analysis & Conclusions</span>
                </div>
              </div>
            </div>

            {/* Live Observations */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Live Observations</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Completed Tubes:</span>
                  <span className="font-semibold">{testTubes.filter(t => t.isCompleted).length}/12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max Color Intensity:</span>
                  <span className="font-semibold text-red-600">
                    {Math.max(...testTubes.map(t => t.colorIntensity), 0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Current Phase:</span>
                  <span className="font-semibold capitalize">
                    {phase.current.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Intensity Chart */}
            {showAnalysis && colorimetryData.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Color Intensity Data</h4>
                <div className="space-y-2">
                  {colorimetryData.slice(0, 6).map((data) => (
                    <div key={data.tubeId} className="flex items-center justify-between text-xs">
                      <span className="font-medium">{data.tubeId.toUpperCase()}:</span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: testTubes.find(t => t.id === data.tubeId)?.colorHex }}
                        ></div>
                        <span>{data.absorbance.toFixed(3)} abs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Actions Log */}
            {experimentLog.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Recent Actions</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {experimentLog.slice(-5).reverse().map((log) => (
                    <div key={log.id} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="font-medium">{log.action} → {log.tubeId.toUpperCase()}</div>
                      <div className="text-gray-600">{log.volume} mL | {log.observation}</div>
                    </div>
                  ))}
                </div>
              </div>
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
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
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
