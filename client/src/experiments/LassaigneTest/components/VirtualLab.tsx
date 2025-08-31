import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Beaker, FlaskConical, Droplets, TestTube, ShieldAlert, Sparkles, Eraser } from "lucide-react";
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
      title: "Halogen Test (AgNO₃)",
      icon: <Sparkles className="w-5 h-5" />,
      description: "After HNO₃ treatment, add AgNO₃ to observe halide precipitate.",
      canRun: hasExtract && interferenceRemoved && halide == null,
      run: () => {
        // Randomly pick a halide to simulate different outcomes
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
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {!experimentStarted && (
        <div className="col-span-1 lg:col-span-2">
          <Card className="border-blue-100">
            <CardContent className="p-6 text-center">
              <ShieldAlert className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-700 mb-4">Start the virtual lab to prepare the extract and run detection tests.</p>
              <Button onClick={onStartExperiment} className="bg-blue-600 hover:bg-blue-700 text-white">Start Lab</Button>
            </CardContent>
          </Card>
        </div>
      )}

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
  );
}
