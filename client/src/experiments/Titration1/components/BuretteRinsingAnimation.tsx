import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets, CheckCircle, ArrowRight, FlaskConical, Beaker } from "lucide-react";

interface BuretteRinsingAnimationProps {
  onComplete: () => void;
}

interface AnimationStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  illustration: string;
}

const animationSteps: AnimationStep[] = [
  {
    id: 1,
    title: "Rinse with Distilled Water",
    description: "Rinse the burette thoroughly with distilled water to remove any impurities",
    duration: 3000,
    illustration: "💧"
  },
  {
    id: 2,
    title: "Discard Water Rinse",
    description: "Discard the water rinse completely through the burette tip",
    duration: 2000,
    illustration: "🚰"
  },
  {
    id: 3,
    title: "Rinse with NaOH Solution",
    description: "Rinse with a few mL of NaOH solution to condition the burette",
    duration: 3000,
    illustration: "🧪"
  },
  {
    id: 4,
    title: "Discard NaOH Rinse",
    description: "Discard the NaOH rinse to prevent dilution",
    duration: 2000,
    illustration: "🗑️"
  },
  {
    id: 5,
    title: "Fill with NaOH Solution",
    description: "Fill the burette completely with NaOH solution using a funnel",
    duration: 4000,
    illustration: "⬆️"
  },
  {
    id: 6,
    title: "Remove Air Bubbles",
    description: "Open the stopcock to remove air bubbles from the tip",
    duration: 3000,
    illustration: "💨"
  },
  {
    id: 7,
    title: "Set Initial Reading",
    description: "Adjust to zero reading and record initial burette reading (±0.01 mL)",
    duration: 2500,
    illustration: "📊"
  }
];

export default function BuretteRinsingAnimation({ onComplete }: BuretteRinsingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowComplete(false);
    animateNextStep(0);
  };

  const animateNextStep = (stepIndex: number) => {
    if (stepIndex >= animationSteps.length) {
      setIsAnimating(false);
      setShowComplete(true);
      return;
    }

    setCurrentStep(stepIndex);
    
    setTimeout(() => {
      setCompletedSteps(prev => [...prev, stepIndex]);
      animateNextStep(stepIndex + 1);
    }, animationSteps[stepIndex].duration);
  };

  const currentStepData = animationSteps[currentStep];
  const progress = ((completedSteps.length) / animationSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Burette Preparation Protocol
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Essential steps for accurate titration results
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          {!isAnimating && !showComplete && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <FlaskConical className="w-12 h-12 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Proper Burette Preparation
                </h3>
                <p className="text-gray-600 mb-4">
                  Before starting any titration, the burette must be properly cleaned, 
                  conditioned, and filled to ensure accurate measurements.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> This preparation is crucial for obtaining 
                    precise results (±0.01 mL accuracy). Follow each step carefully.
                  </p>
                </div>
              </div>

              <Button
                onClick={startAnimation}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Begin Preparation
              </Button>
            </div>
          )}

          {isAnimating && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep + 1} of {animationSteps.length}
                  </span>
                  <span className="text-sm text-blue-600 font-semibold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Current Step Animation */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md animate-pulse">
                    {currentStepData?.illustration}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                      {currentStepData?.title}
                    </h4>
                    <p className="text-gray-600">
                      {currentStepData?.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="w-6 h-6 text-blue-500 animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Completed Steps Summary */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-gray-700">Completed Steps:</h5>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {animationSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg text-sm ${
                        completedSteps.includes(index)
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : index === currentStep
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {completedSteps.includes(index) ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : index === currentStep ? (
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        ) : (
                          <span className="text-gray-400">{index + 1}</span>
                        )}
                      </div>
                      <span className="flex-1">{step.title}</span>
                      <span className="text-lg">{step.illustration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showComplete && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Burette Preparation Complete!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your burette is now properly prepared and ready for accurate titration. 
                  The initial reading has been set to 0.00 mL.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <Beaker className="w-5 h-5" />
                    <span className="font-semibold">
                      Initial Reading: 0.00 ± 0.01 mL
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={startAnimation}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Watch Again
                </Button>
                <Button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 font-semibold"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Proceed to Titration
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
