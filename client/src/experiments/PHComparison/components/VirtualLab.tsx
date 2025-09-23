import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkBench } from "@/experiments/EquilibriumShift/components/WorkBench";
import { Equipment, PH_LAB_EQUIPMENT } from "./Equipment";
import { COLORS, INITIAL_TESTTUBE, GUIDED_STEPS, ANIMATION } from "../constants";
import { Beaker, Info, Wrench, CheckCircle, ArrowRight, TestTube, Undo2 } from "lucide-react";

interface ExperimentMode {
  current: 'guided';
  currentGuidedStep: number;
}

interface TestTubeState {
  id: string; volume: number; color: string; colorHex: string; contents: string[]; temperature: number;
}

interface VirtualLabProps {
  experimentStarted: boolean;
  onStartExperiment: () => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  mode: ExperimentMode;
  onStepComplete: (stepId?: number) => void;
  onStepUndo?: (stepId?: number) => void;
  onReset: () => void;
  completedSteps: number[];
}

export default function VirtualLab({ experimentStarted, onStartExperiment, isRunning, setIsRunning, mode, onStepComplete, onStepUndo, onReset, completedSteps }: VirtualLabProps) {
  const [testTube, setTestTube] = useState<TestTubeState>(INITIAL_TESTTUBE);
  const [currentStep, setCurrentStep] = useState(1);
  const [equipmentOnBench, setEquipmentOnBench] = useState<Array<{ id: string; position: { x: number; y: number }; isActive: boolean }>>([]);
  const [history, setHistory] = useState<Array<{ type: 'HCL' | 'CH3COOH' | 'IND'; volume: number }>>([]);
  const [activeEquipment, setActiveEquipment] = useState<string>("");
  const [showToast, setShowToast] = useState<string>("");
  const [showHclDialog, setShowHclDialog] = useState(false);
  const [hclVolume, setHclVolume] = useState<string>("5.0");
  const [previewHclVolume, setPreviewHclVolume] = useState<number | null>(5.0);
  const [hclError, setHclError] = useState<string | null>(null);
  const [showAceticDialog, setShowAceticDialog] = useState(false);
  const [aceticVolume, setAceticVolume] = useState<string>("5.0");
  const [previewAceticVolume, setPreviewAceticVolume] = useState<number | null>(5.0);
  const [aceticError, setAceticError] = useState<string | null>(null);
  const [showIndicatorDialog, setShowIndicatorDialog] = useState(false);
  const [indicatorVolume, setIndicatorVolume] = useState<string>("0.5");
  const [previewIndicatorVolume, setPreviewIndicatorVolume] = useState<number | null>(0.5);
  const [indicatorError, setIndicatorError] = useState<string | null>(null);

  // Comparison mode and snapshots
  const [compareMode, setCompareMode] = useState(false);
  const [hclSample, setHclSample] = useState<TestTubeState | null>(null);
  const [aceticSample, setAceticSample] = useState<TestTubeState | null>(null);

  useEffect(() => { setCurrentStep((mode.currentGuidedStep || 0) + 1); }, [mode.currentGuidedStep]);

  const getEquipmentPosition = (equipmentId: string) => {
    const positions: Record<string, { x: number; y: number }> = {
      'test-tube': { x: 200, y: 250 },
      'hcl-0-01m': { x: 500, y: 130 },
      'acetic-0-01m': { x: 500, y: 300 },
      'universal-indicator': { x: 500, y: 470 },
    };
    return positions[equipmentId] || { x: 300, y: 250 };
  };

  // Capture snapshots automatically when recognizable end-states are reached
  useEffect(() => {
    if (testTube.contents.includes('IND') && testTube.contents.includes('HCL') && testTube.colorHex === COLORS.HCL_PH2) {
      setHclSample(testTube);
    }
    if (testTube.contents.includes('IND') && testTube.contents.includes('CH3COOH') && testTube.colorHex === COLORS.ACETIC_PH3) {
      setAceticSample(testTube);
    }
  }, [testTube]);

  const animateColorTransition = (toColor: string) => {
    const fromColor = testTube.colorHex;
    const totalSteps = 16;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const p = step / totalSteps;
      const r1 = parseInt(fromColor.slice(1,3),16), g1 = parseInt(fromColor.slice(3,5),16), b1 = parseInt(fromColor.slice(5,7),16);
      const r2 = parseInt(toColor.slice(1,3),16), g2 = parseInt(toColor.slice(3,5),16), b2 = parseInt(toColor.slice(5,7),16);
      const r = Math.round(r1 + (r2 - r1) * p), g = Math.round(g1 + (g2 - g1) * p), b = Math.round(b1 + (b2 - b1) * p);
      const c = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
      setTestTube(prev => ({ ...prev, colorHex: c }));
      if (step >= totalSteps) { clearInterval(interval); setTestTube(prev => ({ ...prev, colorHex: toColor })); }
    }, ANIMATION.COLOR_TRANSITION_DURATION / totalSteps);
  };

  const addToTube = (reagent: 'HCL'|'CH3COOH'|'IND', volume = 3) => {
    setActiveEquipment(reagent);
    setHistory(prev => [...prev, { type: reagent, volume }]);
    setTimeout(() => {
      setTestTube(prev => {
        const newVol = Math.min(prev.volume + volume, 20);
        const contents = Array.from(new Set([...prev.contents, reagent]));
        let color = prev.colorHex;
        if (contents.includes('IND')) {
          if (contents.includes('HCL')) color = COLORS.HCL_PH2;
          else if (contents.includes('CH3COOH')) color = COLORS.ACETIC_PH3;
          else color = COLORS.NEUTRAL;
          animateColorTransition(color);
        }
        return { ...prev, volume: newVol, contents };
      });
      setActiveEquipment("");
      if (reagent === 'IND') setShowToast('Indicator added');
      else setShowToast(`${reagent === 'HCL' ? 'HCl' : 'CH3COOH'} added`);
      setTimeout(() => setShowToast(""), 1500);
    }, ANIMATION.DROPPER_DURATION);
  };

  const handleEquipmentDrop = (equipmentId: string, x: number, y: number) => {
    if (mode.current === 'guided') {
      const stepData = GUIDED_STEPS[currentStep - 1];
      if (!stepData.equipment.includes(equipmentId)) {
        setShowToast(`${equipmentId.replace(/-/g,' ')} is not needed in step ${currentStep}.`);
        setTimeout(() => setShowToast(""), 2000);
        return;
      }
    }

    if (equipmentId === 'test-tube') {
      if (equipmentOnBench.find(e => e.id === 'test-tube')) return;
      setEquipmentOnBench(prev => [...prev, { id: 'test-tube', position: getEquipmentPosition('test-tube'), isActive: true }]);
      onStepComplete(1);
      return;
    }

    const tube = equipmentOnBench.find(e => e.id === 'test-tube');
    if (!tube) {
      setShowToast('Place the test tube first.');
      setTimeout(() => setShowToast(""), 1500);
      return;
    }

    // Do not add acetic acid or open dialog on drop; dialog opens when the placed bottle is pressed
    // Do not add indicator or open dialog on drop; dialog opens when the placed bottle is pressed

    const pos = getEquipmentPosition(equipmentId);
    setEquipmentOnBench(prev => {
      if (!prev.find(e => e.id === equipmentId)) return [...prev, { id: equipmentId, position: pos, isActive: false }];
      return prev;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) {
      const hasTube = !!equipmentOnBench.find(e => e.id === 'test-tube');
      if (hasTube) {
        setEquipmentOnBench(prev => prev.filter(e => e.id !== 'test-tube'));
        setTestTube(INITIAL_TESTTUBE);
        if (onStepUndo) onStepUndo();
        setShowToast('Removed test tube');
        setTimeout(() => setShowToast(""), 1200);
      }
      return;
    }

    const last = history[history.length - 1];
    const remaining = history.slice(0, -1);
    setHistory(remaining);
    setTestTube(prev => {
      const volume = Math.max(0, prev.volume - last.volume);
      const hasEarlier = remaining.some(h => h.type === last.type);
      let contents = prev.contents;
      if (!hasEarlier) contents = contents.filter(c => c !== last.type);
      let colorHex = prev.colorHex;
      if (!contents.includes('IND')) colorHex = COLORS.CLEAR;
      else if (contents.includes('HCL')) colorHex = COLORS.HCL_PH2;
      else if (contents.includes('CH3COOH')) colorHex = COLORS.ACETIC_PH3;
      else colorHex = COLORS.NEUTRAL;
      return { ...prev, volume, contents, colorHex };
    });
    if (onStepUndo) onStepUndo();
    setShowToast('Last action undone');
    setTimeout(() => setShowToast(""), 1200);
  };

  const confirmAddHcl = () => {
    const v = parseFloat(hclVolume);
    if (Number.isNaN(v) || v < 5.0 || v > 10.0) {
      setHclError('Please enter a value between 5.0 and 10.0 mL');
      return;
    }
    addToTube('HCL', v);
    if (currentStep === 2) {
      onStepComplete(2);
    }
    setShowHclDialog(false);
  };

  const confirmAddAcetic = () => {
    const v = parseFloat(aceticVolume);
    if (Number.isNaN(v) || v < 5.0 || v > 10.0) {
      setAceticError('Please enter a value between 5.0 and 10.0 mL');
      return;
    }
    addToTube('CH3COOH', v);
    if (currentStep === 4) {
      onStepComplete(4);
    }
    setShowAceticDialog(false);
  };

  const confirmAddIndicator = () => {
    const v = parseFloat(indicatorVolume);
    if (Number.isNaN(v) || v < 0.2 || v > 1.0) {
      setIndicatorError('Please enter a value between 0.2 and 1.0 mL');
      return;
    }
    addToTube('IND', v);
    if (currentStep === 3 || currentStep === 5) {
      onStepComplete(currentStep);
    }
    setShowIndicatorDialog(false);
  };

  const handleInteract = (id: string) => {
    if (id === 'hcl-0-01m') setShowHclDialog(true);
    if (id === 'acetic-0-01m') setShowAceticDialog(true);
    if (id === 'universal-indicator') setShowIndicatorDialog(true);
  };

  const handleRemove = (id: string) => {
    setEquipmentOnBench(prev => prev.filter(e => e.id !== id));
    if (id === 'test-tube') setTestTube(INITIAL_TESTTUBE);
  };

  const handleCompare = () => {
    setCompareMode(true);
    setEquipmentOnBench(prev => prev.filter(e => e.id === 'test-tube'));
    onStepComplete(6);
  };

  const stepsProgress = (
    <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Experiment Progress</h3>
        <span className="text-sm text-blue-600 font-medium">Step {currentStep} of {GUIDED_STEPS.length}</span>
      </div>
      <div className="flex space-x-2 mb-4">
        {GUIDED_STEPS.map((step) => (
          <div key={step.id} className={`flex-1 h-2 rounded-full ${completedSteps.includes(step.id) ? 'bg-green-500' : currentStep === step.id ? 'bg-blue-500' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completedSteps.includes(currentStep) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
          {completedSteps.includes(currentStep) ? <CheckCircle className="w-4 h-4" /> : <span className="text-sm font-bold">{currentStep}</span>}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">{GUIDED_STEPS[currentStep-1].title}</h4>
          <p className="text-sm text-gray-600 mb-2">{GUIDED_STEPS[currentStep-1].description}</p>
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <ArrowRight className="w-3 h-3 mr-1" />
            {GUIDED_STEPS[currentStep-1].action}
          </div>
        </div>
      </div>
    </div>
  );

  const shouldShowRestore = testTube.contents.includes('IND') && testTube.contents.includes('HCL') && testTube.colorHex === COLORS.HCL_PH2;

  const handleRestore = () => {
    setHistory([]);
    setTestTube(prev => ({ ...prev, volume: 0, contents: [], colorHex: COLORS.CLEAR }));
  };

  return (
    <TooltipProvider>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
        {stepsProgress}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Equipment - Left */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                Equipment
              </h3>
              <div className="space-y-3">
                {PH_LAB_EQUIPMENT.map((eq) => (
                  <Equipment key={eq.id} id={eq.id} name={eq.name} icon={eq.icon} disabled={!experimentStarted} />
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700"><strong>Tip:</strong> Drag equipment to the workbench following the steps.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleUndo} variant="outline" className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center">
                <Undo2 className="w-4 h-4 mr-2" /> UNDO
              </Button>
              <Button onClick={() => { setEquipmentOnBench([]); setTestTube(INITIAL_TESTTUBE); setHistory([]); onReset(); }} variant="outline" className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100">Reset Experiment</Button>
            </div>
          </div>

          {/* Workbench - Center */}
          <div className="lg:col-span-6">
            <WorkBench onDrop={handleEquipmentDrop} isRunning={isRunning} currentStep={currentStep}>
              {equipmentOnBench.find(e => e.id === 'test-tube') && !compareMode && (
                <>
                  <Equipment id="test-tube" name="20 mL Test Tube" icon={<TestTube className="w-8 h-8" />} position={getEquipmentPosition('test-tube')} onRemove={handleRemove} onInteract={() => {}} color={testTube.colorHex} volume={testTube.volume} displayVolume={showHclDialog && previewHclVolume != null ? previewHclVolume : showAceticDialog && previewAceticVolume != null ? previewAceticVolume : showIndicatorDialog && previewIndicatorVolume != null ? Math.min(20, testTube.volume + previewIndicatorVolume) : testTube.volume} isActive={true} />
                  {shouldShowRestore && (
                    <div style={{ position: 'absolute', left: getEquipmentPosition('test-tube').x, top: getEquipmentPosition('test-tube').y + 220, transform: 'translate(-50%, 0)' }}>
                      <Button size="sm" variant="outline" className="bg-white border-gray-300 shadow-sm" onClick={handleRestore}>RESTORE</Button>
                    </div>
                  )}

                  {/* Show COMPARE when solution is yellow (acetic acid + indicator) */}
                  {testTube.contents.includes('IND') && testTube.contents.includes('CH3COOH') && testTube.colorHex === COLORS.ACETIC_PH3 && (
                    <div style={{ position: 'absolute', left: getEquipmentPosition('test-tube').x, top: getEquipmentPosition('test-tube').y + 260, transform: 'translate(-50%, 0)' }}>
                      <Button size="sm" className="shadow-sm" onClick={handleCompare}>COMPARE</Button>
                    </div>
                  )}
                </>
              )}

              {equipmentOnBench.filter(e => e.id !== 'test-tube').map(e => (
                <Equipment
                  key={e.id}
                  id={e.id}
                  name={PH_LAB_EQUIPMENT.find(x => x.id === e.id)?.name || e.id}
                  icon={PH_LAB_EQUIPMENT.find(x => x.id === e.id)?.icon || <Beaker className="w-8 h-8" />}
                  position={e.position}
                  onRemove={handleRemove}
                  onInteract={handleInteract}
                />
              ))}
              {/* Comparison overlay */}
              {compareMode && (
                <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-72">
                        <img src="https://cdn.builder.io/api/v1/image/assets%2Fc52292a04d4c4255a87bdaa80a28beb9%2F3dd94cfaa2fc4876a1e3759c6d76db7e?format=webp&width=800" alt="Test tube" className="w-full h-full object-contain" />
                        <div className="absolute left-1/2 -translate-x-1/2 transition-all" style={{ bottom: '28px', width: '28px', height: '150px', overflow: 'hidden', borderRadius: '0 0 14px 14px' }}>
                          <div className="absolute left-0 right-0 bottom-0 transition-all duration-500" style={{ height: `${Math.max(0, Math.min(150, ((Math.min(Math.max((hclSample?.volume ?? 10), 0), 20) / 20) * 150)))}px`, backgroundColor: COLORS.HCL_PH2, boxShadow: 'inset 0 0 6px rgba(0,0,0,0.25), 0 0 3px rgba(0,0,0,0.1)', opacity: 0.85 }} />
                        </div>
                      </div>
                      <span className="text-sm font-medium mt-2">0.01 M HCl + Indicator</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-72">
                        <img src="https://cdn.builder.io/api/v1/image/assets%2Fc52292a04d4c4255a87bdaa80a28beb9%2F3dd94cfaa2fc4876a1e3759c6d76db7e?format=webp&width=800" alt="Test tube" className="w-full h-full object-contain" />
                        <div className="absolute left-1/2 -translate-x-1/2 transition-all" style={{ bottom: '28px', width: '28px', height: '150px', overflow: 'hidden', borderRadius: '0 0 14px 14px' }}>
                          <div className="absolute left-0 right-0 bottom-0 transition-all duration-500" style={{ height: `${Math.max(0, Math.min(150, ((Math.min(Math.max((aceticSample?.volume ?? 10), 0), 20) / 20) * 150)))}px`, backgroundColor: COLORS.ACETIC_PH3, boxShadow: 'inset 0 0 6px rgba(0,0,0,0.25), 0 0 3px rgba(0,0,0,0.1)', opacity: 0.85 }} />
                        </div>
                      </div>
                      <span className="text-sm font-medium mt-2">0.01 M CH3COOH + Indicator</span>
                    </div>
                  </div>
                </div>
              )}
            </WorkBench>
          </div>

          {/* Analysis - Right */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-green-600" />
                Live Analysis
              </h3>
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Current Solution</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: testTube.colorHex }}></div>
                  <span className="text-sm">{testTube.colorHex === COLORS.CLEAR ? 'Clear (no indicator)' : 'With indicator'}</span>
                </div>
                <p className="text-xs text-gray-600">Contents: {testTube.contents.join(', ') || 'None'}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Completed Steps</h4>
                <div className="space-y-1">
                  {GUIDED_STEPS.map((step) => (
                    <div key={step.id} className={`flex items-center space-x-2 text-xs ${completedSteps.includes(step.id) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3" />
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {showToast && (
              <div className="p-3 rounded bg-blue-50 border border-blue-200 text-blue-700 text-sm">{showToast}</div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showHclDialog} onOpenChange={(open) => { setShowHclDialog(open); if (!open) setPreviewHclVolume(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Volume</DialogTitle>
            <DialogDescription>
              Enter the volume of 0.01 M HCl to add to the test tube.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Volume (mL)</label>
            <input
              type="number"
              step="0.1"
              min={5.0}
              max={10.0}
              value={hclVolume}
              onChange={(e) => {
                const val = e.target.value;
                setHclVolume(val);
                const parsed = parseFloat(val);
                if (!Number.isNaN(parsed)) {
                  setPreviewHclVolume(Math.min(10.0, Math.max(5.0, parsed)));
                  if (parsed < 5.0 || parsed > 10.0) setHclError("Please enter a value between 5.0 and 10.0 mL");
                  else setHclError(null);
                } else {
                  setPreviewHclVolume(null);
                  setHclError("Enter a valid number");
                }
              }}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter volume in mL"
            />
            {hclError && <p className="text-xs text-red-600">{hclError}</p>}
            <p className="text-xs text-gray-500">Recommended range: 5.0 – 10.0 mL</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHclDialog(false)}>Cancel</Button>
            <Button onClick={confirmAddHcl} disabled={!!hclError || Number.isNaN(parseFloat(hclVolume)) || parseFloat(hclVolume) < 5.0 || parseFloat(hclVolume) > 10.0}>Add Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAceticDialog} onOpenChange={(open) => { setShowAceticDialog(open); if (!open) setPreviewAceticVolume(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Volume</DialogTitle>
            <DialogDescription>
              Enter the volume of 0.01 M CH3COOH to add to the test tube.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Volume (mL)</label>
            <input
              type="number"
              step="0.1"
              min={5.0}
              max={10.0}
              value={aceticVolume}
              onChange={(e) => {
                const val = e.target.value;
                setAceticVolume(val);
                const parsed = parseFloat(val);
                if (!Number.isNaN(parsed)) {
                  setPreviewAceticVolume(Math.min(10.0, Math.max(5.0, parsed)));
                  if (parsed < 5.0 || parsed > 10.0) setAceticError("Please enter a value between 5.0 and 10.0 mL");
                  else setAceticError(null);
                } else {
                  setPreviewAceticVolume(null);
                  setAceticError("Enter a valid number");
                }
              }}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter volume in mL"
            />
            {aceticError && <p className="text-xs text-red-600">{aceticError}</p>}
            <p className="text-xs text-gray-500">Recommended range: 5.0 – 10.0 mL</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAceticDialog(false)}>Cancel</Button>
            <Button onClick={confirmAddAcetic} disabled={!!aceticError || Number.isNaN(parseFloat(aceticVolume)) || parseFloat(aceticVolume) < 5.0 || parseFloat(aceticVolume) > 10.0}>Add Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showIndicatorDialog} onOpenChange={(open) => { setShowIndicatorDialog(open); if (!open) setPreviewIndicatorVolume(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Volume</DialogTitle>
            <DialogDescription>
              Enter the volume of Universal Indicator to add to the test tube.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Volume (mL)</label>
            <input
              type="number"
              step="0.1"
              min={0.2}
              max={1.0}
              value={indicatorVolume}
              onChange={(e) => {
                const val = e.target.value;
                setIndicatorVolume(val);
                const parsed = parseFloat(val);
                if (!Number.isNaN(parsed)) {
                  const bounded = Math.min(1.0, Math.max(0.2, parsed));
                  setPreviewIndicatorVolume(bounded);
                  if (parsed < 0.2 || parsed > 1.0) setIndicatorError("Please enter a value between 0.2 and 1.0 mL");
                  else setIndicatorError(null);
                } else {
                  setPreviewIndicatorVolume(null);
                  setIndicatorError("Enter a valid number");
                }
              }}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter volume in mL"
            />
            {indicatorError && <p className="text-xs text-red-600">{indicatorError}</p>}
            <p className="text-xs text-gray-500">Recommended range: 0.2 – 1.0 mL</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIndicatorDialog(false)}>Cancel</Button>
            <Button onClick={confirmAddIndicator} disabled={!!indicatorError || Number.isNaN(parseFloat(indicatorVolume)) || parseFloat(indicatorVolume) < 0.2 || parseFloat(indicatorVolume) > 1.0}>Add Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
