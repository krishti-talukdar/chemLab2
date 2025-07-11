import React from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface StepTrackerProps {
  currentStep: number;
  totalSteps: number;
  experimentStarted: boolean;
}

export default function StepTracker({
  currentStep,
  totalSteps,
  experimentStarted,
}: StepTrackerProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const getStepIcon = (stepNumber: number) => {
    if (!experimentStarted) {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }

    if (stepNumber < currentStep) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (stepNumber === currentStep) {
      return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
    } else {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepStyle = (stepNumber: number) => {
    if (!experimentStarted) {
      return "bg-gray-100 text-gray-400 border-gray-200";
    }

    if (stepNumber < currentStep) {
      return "bg-green-50 text-green-700 border-green-200";
    } else if (stepNumber === currentStep) {
      return "bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-200";
    } else {
      return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  const getConnectorStyle = (stepNumber: number) => {
    if (!experimentStarted) {
      return "bg-gray-200";
    }

    if (stepNumber < currentStep) {
      return "bg-green-400";
    } else {
      return "bg-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Step Tracker</h3>
        {experimentStarted && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Current Step:</span>
            <span className="text-sm font-bold text-blue-600">
              Step {currentStep}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center">
        {steps.map((stepNumber, index) => (
          <React.Fragment key={stepNumber}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 ${getStepStyle(stepNumber)}
                `}
              >
                {getStepIcon(stepNumber)}
              </div>
              <span className="text-xs mt-1 font-medium">{stepNumber}</span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={`
                    h-0.5 transition-all duration-500 ${getConnectorStyle(stepNumber + 1)}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {!experimentStarted && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Start the experiment to begin step tracking
        </p>
      )}
    </div>
  );
}
