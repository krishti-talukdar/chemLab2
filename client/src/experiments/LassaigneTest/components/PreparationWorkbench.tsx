import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, Flame, Droplets, Filter, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface Step {
  title: string;
  instruction: string;
  actionLabel: string;
}

const steps: Step[] = [
  {
    title: "Setup Equipment",
    instruction:
      "Place ignition tube with a small dry piece of sodium and the organic compound ready with tongs and a beaker of water for quenching.",
    actionLabel: "Place Equipment",
  },
  {
    title: "Heat with Sodium",
    instruction:
      "Heat the ignition tube strongly until it becomes red hot so that sodium reacts to form soluble salts (NaCN/Na2S/NaX).",
    actionLabel: "Heat to Red Hot",
  },
  {
    title: "Quench and Boil",
    instruction:
      "Quench the hot tube in water, then boil the mixture and crush the residue to dissolve sodium salts into the solution.",
    actionLabel: "Quench & Boil",
  },
  {
    title: "Filter the Extract",
    instruction:
      "Filter the hot mixture to obtain a clear aqueous Lassaigne's extract for subsequent tests.",
    actionLabel: "Filter → Obtain Extract",
  },
];

export default function PreparationWorkbench() {
  const [, navigate] = useLocation();
  const [current, setCurrent] = useState(0);
  const progress = Math.round(((current) / (steps.length)) * 100);

  const next = () => {
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else finish();
  };

  const finish = () => {
    localStorage.setItem("lassaigne:hasExtract", "true");
    navigate("/experiment/7");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate("/experiment/7")} className="text-blue-600 hover:text-blue-700 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lassaigne's Test
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lassaigne's Extract Preparation - Workbench</h1>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Preparation Progress</span>
          <span className="text-sm text-blue-600 font-semibold">{Math.round(((current+1)/steps.length)*100)}%</span>
        </div>
        <Progress value={((current+1)/steps.length)*100} className="h-2 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Equipment */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Equipment</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Sodium metal (under kerosene)</li>
                <li>• Ignition tube</li>
                <li>• Tongs</li>
                <li>• Beaker with water (for quenching)</li>
                <li>• Mortar/pestle or glass rod</li>
                <li>• Filter paper and funnel</li>
              </ul>
              <div className="mt-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                Safety: Sodium reacts violently with water. Use forceps; heat behind a shield.
              </div>
            </CardContent>
          </Card>

          {/* Workbench */}
          <Card className="lg:col-span-2 min-h-[420px]">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                {current === 0 ? <FlaskConical className="w-7 h-7" /> : current === 1 ? <Flame className="w-7 h-7" /> : current === 2 ? <Droplets className="w-7 h-7" /> : <Filter className="w-7 h-7" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{steps[current].title}</h3>
              <p className="text-gray-700 max-w-md mb-5">{steps[current].instruction}</p>
              <Button onClick={next} className="bg-blue-600 hover:bg-blue-700 text-white">
                {current < steps.length - 1 ? steps[current].actionLabel : "Finish & Continue"}
              </Button>
            </CardContent>
          </Card>

          {/* Live Analysis */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Live Analysis</h3>
              <div className="text-sm text-gray-700 mb-3">
                <div className="flex items-center gap-2 text-emerald-700 mb-1">
                  <CheckCircle className="w-4 h-4" /> Current Phase: {current < steps.length - 1 ? "Preparation" : "Extract Ready"}
                </div>
                <p>Observation updates as you proceed through each step. Ensure a clear filtrate is obtained.</p>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className={current >= 0 ? "text-emerald-700" : ""}>✓ Setup complete</li>
                <li className={current >= 1 ? "text-emerald-700" : ""}>✓ Tube heated to red hot</li>
                <li className={current >= 2 ? "text-emerald-700" : ""}>✓ Quenched and boiled</li>
                <li className={current >= 3 ? "text-emerald-700" : ""}>✓ Filtered extract obtained</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
