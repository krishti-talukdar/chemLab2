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
import { TestTube, Beaker, FlaskConical, Droplets, Filter, Flame } from "lucide-react";

export default function WorkBench({ step, totalSteps, equipmentItems, onNext, onFinish }: PrepWorkbenchProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [placed, setPlaced] = useState<Array<{ id: string; x: number; y: number }>>([]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const eqId = e.dataTransfer.getData("equipment");
    if (!eqId) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(16, Math.min(e.clientX - rect.left - 24, rect.width - 48));
    const y = Math.max(16, Math.min(e.clientY - rect.top - 24, rect.height - 48));
    setPlaced(prev => [...prev, { id: eqId, x, y }]);

    // Auto-progress steps based on expected sequence
    const sequence = [
      "ignition-tube",       // Step 1
      "sodium-piece",        // Step 2
      "organic-compound",    // Step 3
      "bunsen-burner",       // Step 4
      "water-bath",          // Step 5
      "filter-funnel"        // Step 6
    ];
    const expected = sequence[step];
    if (expected && eqId === expected) {
      if (step < totalSteps - 1) onNext();
      else onFinish();
    }
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

      {(() => {
        const hasIgnitionTube = placed.some(p => p.id === "ignition-tube");
        const hasSodiumPiece = placed.some(p => p.id === "sodium-piece");
        const hasOrganicCompound = placed.some(p => p.id === "organic-compound");
        const hasBunsenBurner = placed.some(p => p.id === "bunsen-burner");
        return placed.map((p, idx) => {
          const item = findItem(p.id);
          if (!item) return null;
          if (p.id === "sodium-piece" && hasIgnitionTube) return null;
          if (p.id === "organic-compound" && hasIgnitionTube) return null;
          const Icon =
            p.id === "ignition-tube"
              ? TestTube
              : p.id === "sodium-piece"
              ? Beaker
              : p.id === "bunsen-burner"
              ? Flame
              : p.id === "organic-compound"
              ? FlaskConical
              : p.id === "water-bath"
              ? Droplets
              : Filter;
          const colorClass =
            p.id === "ignition-tube"
              ? "text-blue-600"
              : p.id === "sodium-piece"
              ? "text-emerald-600"
              : p.id === "bunsen-burner"
              ? "text-orange-500"
              : p.id === "organic-compound"
              ? "text-purple-600"
              : p.id === "water-bath"
              ? "text-blue-500"
              : "text-amber-600";
          return (
            <div
              key={`${p.id}-${idx}`}
              className="absolute select-none"
              style={{ left: p.x, top: p.y }}
            >
              <div className="flex flex-col items-center">
                <div className={`${p.id === "ignition-tube" ? "w-56 h-64" : p.id === "bunsen-burner" ? "w-24 h-24" : "w-16 h-16"} relative rounded-lg bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center ${colorClass}`}>
                  {p.id === "ignition-tube" ? (
                    <>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Fc52292a04d4c4255a87bdaa80a28beb9%2F320141ac949c402cb646f053900e49f8?format=webp&width=800"
                        alt="Fusion Tube"
                        className="max-w-[176px] max-h-[208px] object-contain"
                      />
                      {hasSodiumPiece && (
                        <div className="absolute bottom-10 left-[53%] -translate-x-1/2 pointer-events-none">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-400 shadow-md"
                            style={{
                              background:
                                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(229,231,235,0.9) 40%, #9ca3af 70%, #6b7280 100%)",
                            }}
                          />
                        </div>
                      )}
                      {hasOrganicCompound && (
                        <div className="absolute bottom-12 left-[53%] -translate-x-1/2 pointer-events-none">
                          <div className="relative w-[22px] h-[110px] overflow-hidden">
                            <div
                              className="absolute bottom-0 left-0 right-0"
                              style={{
                                height: "22%",
                                background: "linear-gradient(to top, #fde68a, #f59e0b)",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                opacity: 0.95,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : p.id === "bunsen-burner" ? (
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fc52292a04d4c4255a87bdaa80a28beb9%2Fc4be507c9a054f00b694808aa900a9e5?format=webp&width=800" alt="Bunsen Burner" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className="mt-1 text-xs font-medium text-gray-700 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                  {item.label}
                </span>
              </div>
            </div>
          );
        });
      })()}

      {placed.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-sm text-blue-500 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 shadow-sm">
            Drag equipment here
          </div>
        </div>
      )}
      <style>{`
@keyframes flameFlicker {
  0% { transform: translateY(0) scaleY(1); opacity: .9; }
  50% { transform: translateY(-2px) scaleY(1.1); opacity: 1; }
  100% { transform: translateY(0) scaleY(.95); opacity: .85; }
}
`}</style>
    </div>
  );
}
