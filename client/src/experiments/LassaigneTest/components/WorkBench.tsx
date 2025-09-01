import React from "react";

interface EquipmentItem {
  id: string;
  label: string;
}

interface PrepWorkbenchProps {
  step: number;
  totalSteps: number;
  title: string;
  detail: string;
  onNext: () => void;
  onFinish: () => void;
  equipmentItems: EquipmentItem[];
}

import { useRef, useState } from "react";

export default function WorkBench({ step, totalSteps, equipmentItems }: PrepWorkbenchProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [placed, setPlaced] = useState<Array<{ id: string; x: number; y: number }>>([]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const eqId = e.dataTransfer.getData("text/equipment");
    if (!eqId) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(16, Math.min(e.clientX - rect.left - 24, rect.width - 48));
    const y = Math.max(16, Math.min(e.clientY - rect.top - 24, rect.height - 48));
    setPlaced(prev => [...prev, { id: eqId, x, y }]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const findItem = (id: string) => equipmentItems.find(i => i.id === id);

  return (
    <div
      ref={containerRef}
      onDrop={onDrop}
      onDragOver={handleDragOver}
      className="relative w-full h-full min-h[500px] min-h-[500px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg overflow-hidden transition-all duration-300 border-2 border-dashed border-gray-300"
      style={{
        backgroundImage: `
          linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%),
          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)
        `,
      }}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
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

      {placed.map((p, idx) => {
        const item = findItem(p.id);
        if (!item) return null;
        return (
          <div
            key={`${p.id}-${idx}`}
            className="absolute select-none"
            style={{ left: p.x, top: p.y }}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center text-blue-600">
                {/* Icon rendered via label initial to avoid JSX transfer; label visible below */}
                <span className="font-semibold">{item.label.charAt(0)}</span>
              </div>
              <span className="mt-1 text-xs font-medium text-gray-700 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-sm text-blue-500 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 shadow-sm">
          Drag equipment here
        </div>
      </div>
    </div>
  );
}
