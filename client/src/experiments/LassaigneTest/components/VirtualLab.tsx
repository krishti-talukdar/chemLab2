import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Beaker, FlaskConical, Droplets, TestTube, ShieldAlert, Sparkles, Eraser, Play } from "lucide-react";
import type { ExperimentMode } from "../types";

interface VirtualLabProps {
  experimentStarted: boolean;
  onStartExperiment: () => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  mode: ExperimentMode;
  onStepComplete: (stepId?: number) => void;
  onStepUndo: (stepId?: number) => void;
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
  onStepUndo,
  onReset,
  completedSteps,
}: VirtualLabProps) {
  const [hasExtract, setHasExtract] = useState(false);
  const [nitrogenPositive, setNitrogenPositive] = useState(false);
  const [sulphurPositive, setSulphurPositive] = useState<null | "lead" | "nitroprusside">(null);
  const [halide, setHalide] = useState<null | "Cl" | "Br" | "I">(null);
  const [interferenceRemoved, setInterferenceRemoved] = useState(false);

  const currentGuidedStep = mode.currentGuidedStep ?? 0;

  const actions = useMemo(() => ([
    {
      id: 1,
      stepId: 1,
      title: "Prepare Lassaigne's Extract",
      icon: <FlaskConical className="w-5 h-5" />,
      description: "Heat organic compound with sodium, then quench and filter to obtain clear extract.",
      canRun: !hasExtract,
      run: () => {
        setHasExtract(true);
        onStepComplete(1);
      },
      observation: hasExtract ? "Clear aqueous extract obtained" : "",
    },
    {
      id: 2,
      stepId: 4,
      title: "Nitrogen Test (Prussian Blue)",
      icon: <Beaker className="w-5 h-5" />,
      description: "Add FeSO₄, boil, cool, acidify with HCl, then add FeCl₃.",
      canRun: hasExtract && !nitrogenPositive,
      run: () => {
        setNitrogenPositive(true);
        onStepComplete(4);
      },
      observation: nitrogenPositive ? "Prussian blue formed → Nitrogen present" : "",
    },
    {
      id: 3,
      stepId: 6,
      title: "Sulphur Test (Lead Acetate)",
      icon: <TestTube className="w-5 h-5" />,
      description: "Acidify with acetic acid and add lead acetate.",
      canRun: hasExtract && sulphurPositive !== "lead",
      run: () => {
        setSulphurPositive("lead");
        onStepComplete(6);
      },
      observation: sulphurPositive === "lead" ? "Black ppt of PbS → Sulphur present" : "",
    },
    {
      id: 4,
      stepId: 7,
      title: "Sulphur Test (Nitroprusside)",
      icon: <Droplets className="w-5 h-5" />,
      description: "Make alkaline and add sodium nitroprusside.",
      canRun: hasExtract && sulphurPositive !== "nitroprusside",
      run: () => {
        setSulphurPositive("nitroprusside");
        onStepComplete(7);
      },
      observation: sulphurPositive === "nitroprusside" ? "Purple/violet color → Sulphur present" : "",
    },
    {
      id: 5,
      stepId: 7,
      title: "Remove Interference (for Halide Test)",
      icon: <Eraser className="w-5 h-5" />,
      description: "Boil a fresh portion with dilute HNO₃ to destroy CN⁻/S²⁻.",
      canRun: hasExtract && !interferenceRemoved,
      run: () => {
        setInterferenceRemoved(true);
        onStepComplete(7);
      },
      observation: interferenceRemoved ? "CN⁻/S²⁻ removed by HNO₃ boiling" : "",
    },
    {
      id: 6,
      stepId: 8,
      title: "Halogen Test (AgNO₃)",
      icon: <Sparkles className="w-5 h-5" />,
      description: "After HNO₃ treatment, add AgNO₃ to observe halide precipitate.",
      canRun: hasExtract && interferenceRemoved && halide == null,
      run: () => {
        const halides: Array<"Cl" | "Br" | "I"> = ["Cl", "Br", "I"];
        const picked = halides[Math.floor(Math.random() * halides.length)];
        setHalide(picked);
        onStepComplete(8);
      },
      observation:
        halide === "Cl"
          ? "White curdy ppt (AgCl)"
          : halide === "Br"
            ? "Cream ppt (AgBr)"
            : halide === "I"
              ? "Yellow ppt (AgI)"
              : "",
    },
  ]), [hasExtract, nitrogenPositive, sulphurPositive, interferenceRemoved, halide, onStepComplete]);

  return (
    <div className="relative min-h-[70vh] p-6">
      {!experimentStarted && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Explore Lassaigne's Test?</h3>
            <p className="text-gray-600 mb-6">Start your interactive journey with qualitative analysis. Prepare Lassaigne's extract and detect nitrogen, sulphur, and halides using classic spot tests.</p>
            <button onClick={onStartExperiment} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 mx-auto transform hover:scale-105">
              <Play className="w-5 h-5" />
              <span>Start Virtual Lab</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
        {actions.map((action) => (
          <Card key={action.id} className={`transition-all ${currentGuidedStep + 1 === action.id ? 'ring-2 ring-blue-400' : ''}`}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">{action.icon}</div>
                <h4 className="font-semibold text-gray-900">{action.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>

              <div className="flex items-center gap-3">
                <Button size="sm" onClick={action.run} disabled={!action.canRun || !experimentStarted}>
                  Run
                </Button>
                {action.observation && (
                  <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-md text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" /> {action.observation}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
