import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkBench } from "@/experiments/EquilibriumShift/components/WorkBench";
import { Equipment, PH_LAB_EQUIPMENT } from "./Equipment";
import { COLORS, INITIAL_TESTTUBE, GUIDED_STEPS, ANIMATION } from "../constants";
import { Beaker, Droplets, FlaskConical, Info } from "lucide-react";

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
  const [activeEquipment, setActiveEquipment] = useState<string>("");
  const [showToast, setShowToast] = useState<string>("");

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

    // Only allow drop if tube present
    const tube = equipmentOnBench.find(e => e.id === 'test-tube');
    if (!tube) {
      setShowToast('Place the test tube first.');
      setTimeout(() => setShowToast(""), 1500);
      return;
    }

    if (equipmentId === 'hcl-0-01m') addToTube('HCL');
    if (equipmentId === 'acetic-0-01m') addToTube('CH3COOH');
    if (equipmentId === 'universal-indicator') addToTube('IND', 0.5);

    const pos = getEquipmentPosition(equipmentId);
    setEquipmentOnBench(prev => {
      if (!prev.find(e => e.id === equipmentId)) return [...prev, { id: equipmentId, position: pos, isActive: false }];
      return prev;
    });
  };

  const handleInteract = (id: string) => {
    if (id === 'hcl-0-01m') addToTube('HCL');
    if (id === 'acetic-0-01m') addToTube('CH3COOH');
    if (id === 'universal-indicator') addToTube('IND', 0.5);
  };

  const handleRemove = (id: string) => {
    setEquipmentOnBench(prev => prev.filter(e => e.id !== id));
    if (id === 'test-tube') setTestTube(INITIAL_TESTTUBE);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      {/* Workbench */}
      <div className="lg:col-span-3">
        <WorkBench onDrop={handleEquipmentDrop} isRunning={isRunning} currentStep={currentStep}>
          {/* Test tube */}
          {equipmentOnBench.find(e => e.id === 'test-tube') && (
            <Equipment id="test-tube" name="Test Tube" icon={<Beaker className="w-8 h-8" />} position={getEquipmentPosition('test-tube')} onRemove={handleRemove} onInteract={() => {}} color={testTube.colorHex} volume={testTube.volume} displayVolume={testTube.volume} isActive={true} />
          )}

          {/* Placed reagents */}
          {equipmentOnBench.filter(e => e.id !== 'test-tube').map(e => (
            <Equipment key={e.id} id={e.id} name={PH_LAB_EQUIPMENT.find(x => x.id === e.id)?.name || e.id} icon={<Beaker className="w-8 h-8" />} position={e.position} onRemove={handleRemove} onInteract={handleInteract} />
          ))}
        </WorkBench>
      </div>

      {/* Equipment toolbar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow p-4 border">
          <h3 className="font-semibold mb-3">Equipment</h3>
          <div className="grid grid-cols-2 gap-3">
            {PH_LAB_EQUIPMENT.map(eq => (
              <Equipment key={eq.id} id={eq.id} name={eq.name} icon={eq.icon} onDrag={() => {}} />
            ))}
          </div>
        </div>

        <div className="mt-4 bg-white rounded-xl shadow p-4 border">
          <h4 className="font-semibold mb-2">Instructions</h4>
          <p className="text-sm text-gray-600">Drag equipment to the bench. Add acid first, then add indicator to observe color.</p>
        </div>

        {showToast && (
          <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-700 text-sm">{showToast}</div>
        )}
      </div>
    </div>
  );
}
