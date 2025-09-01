import React from "react";

interface PrepWorkbenchProps {
  step: number;
  totalSteps: number;
  title: string;
  detail: string;
  onNext: () => void;
  onFinish: () => void;
}

export default function WorkBench({ step, totalSteps, title, detail, onNext, onFinish }: PrepWorkbenchProps) {
  const isLast = step + 1 >= totalSteps;
  return (
    <div
      className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg overflow-hidden transition-all duration-300 border-2 border-dashed border-gray-300"
      style={{
        backgroundImage: `
          linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%),
          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)
        `,
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Step {step + 1} of {totalSteps}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Laboratory Workbench</span>
      </div>

      <div className="absolute inset-0 p-8 flex items-center justify-center">
        <div className="bg-white/90 rounded-xl shadow-xl border border-gray-200 p-8 max-w-2xl w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-700 mb-6">{detail}</p>
          <div className="flex items-center justify-end gap-3">
            {!isLast ? (
              <button onClick={onNext} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">Next</button>
            ) : (
              <button onClick={onFinish} className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">Finish & Use Extract</button>
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
