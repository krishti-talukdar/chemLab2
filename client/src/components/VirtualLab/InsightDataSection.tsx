import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Beaker, Thermometer, Droplets } from "lucide-react";

interface InsightDataSectionProps {
  onBack: () => void;
  onComplete: () => void;
}

export const InsightDataSection: React.FC<InsightDataSectionProps> = ({
  onBack,
  onComplete,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <Beaker className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  Color Change Analysis
                </h1>
                <p className="text-gray-600">
                  Understanding Le Chatelier's Principle
                </p>
              </div>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200">
          <div className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <Droplets className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <h3 className="font-semibold text-pink-800">Pink Solution</h3>
                <p className="text-sm text-pink-600">Hydrated cobalt complex</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Beaker className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Blue Solution</h3>
                <p className="text-sm text-blue-600">Chloride complex</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-800">
                  Temperature Effect
                </h3>
                <p className="text-sm text-orange-600">Equilibrium shifts</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                📚 Data Section Coming Soon
              </h2>
              <p className="text-gray-700 mb-4">
                This section will contain detailed insights about the color
                changes you observed during the experiment.
              </p>
              <p className="text-sm text-gray-600">
                The data and explanations will be added here as requested.
              </p>
            </div>

            <Button
              onClick={onComplete}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              size="lg"
            >
              Complete Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
