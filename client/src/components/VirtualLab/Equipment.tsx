import React, { useState } from "react";
import {
  Beaker,
  FlaskConical,
  TestTube,
  Droplet,
  Thermometer,
} from "lucide-react";

interface EquipmentProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  onDrag: (id: string, x: number, y: number) => void;
  position: { x: number; y: number } | null;
  chemicals?: Array<{
    id: string;
    name: string;
    color: string;
    amount: number;
    concentration: string;
  }>;
  onChemicalDrop?: (
    chemicalId: string,
    equipmentId: string,
    amount: number,
  ) => void;
}

export const Equipment: React.FC<EquipmentProps> = ({
  id,
  name,
  icon,
  onDrag,
  position,
  chemicals = [],
  onChemicalDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("equipment", id);
    e.dataTransfer.effectAllowed = "move";

    // Create enhanced drag preview
    const dragPreview = document.createElement("div");
    dragPreview.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      width: 120px;
      height: 140px;
      background: linear-gradient(145deg, #ffffff, #f0f9ff);
      border: 3px solid #3b82f6;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: rotate(-3deg) scale(1.2);
      z-index: 9999;
      pointer-events: none;
    `;

    // Add enhanced icon
    const iconContainer = document.createElement("div");
    iconContainer.style.cssText = `
      font-size: 48px;
      color: #1d4ed8;
      margin-bottom: 8px;
      filter: drop-shadow(0 4px 8px rgba(29, 78, 216, 0.3));
    `;
    iconContainer.innerHTML = getIconSVG(id);

    // Add enhanced label
    const label = document.createElement("div");
    label.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      color: #1e40af;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      margin: 0 8px;
    `;
    label.textContent = name;

    // Add drag indicator
    const indicator = document.createElement("div");
    indicator.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      background: linear-gradient(45deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    `;
    indicator.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M13 6v5h5l-6 6-6-6h5V6h2z"/></svg>`;

    dragPreview.appendChild(iconContainer);
    dragPreview.appendChild(label);
    dragPreview.appendChild(indicator);
    document.body.appendChild(dragPreview);

    e.dataTransfer.setDragImage(dragPreview, 60, 70);

    // Cleanup
    setTimeout(() => {
      if (dragPreview.parentNode) {
        dragPreview.parentNode.removeChild(dragPreview);
      }
    }, 0);
  };

  const getIconSVG = (equipmentId: string) => {
    const svgMap: Record<string, string> = {
      beaker: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 3h5v5.5l3.5 5.5v6c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-6l3.5-5.5V3zm1 1v4.5L7 14v6h10v-6l-3.5-5.5V4h-3z"/></svg>`,
      flask: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2v4.5L6 12v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-8l-3-5.5V2H9zm2 2h2v4.5l3 5.5v6H8v-6l3-5.5V4z"/></svg>`,
      burette: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v18l-1 2-1-2V2zm0 3h2v13h-2V5z"/></svg>`,
      thermometer: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M17 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM8 14V4c0-1.66 1.34-3 3-3s3 1.34 3 3v10c1.21.91 2 2.37 2 4 0 2.76-2.24 5-5 5s-5-2.24-5-5c0-1.63.79-3.09 2-4z"/></svg>`,
    };
    return svgMap[equipmentId] || svgMap.beaker;
  };

  const handleChemicalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleChemicalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleChemicalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsDropping(true);

    const chemicalData = e.dataTransfer.getData("chemical");
    if (chemicalData && onChemicalDrop) {
      const chemical = JSON.parse(chemicalData);
      onChemicalDrop(chemical.id, id, chemical.volume || 25);

      // Show success feedback
      console.log(
        `Added ${chemical.volume || 25}mL of ${chemical.name} to ${name}`,
      );

      // Reset dropping animation after a delay
      setTimeout(() => setIsDropping(false), 2000);
    }
  };

  const isOnWorkbench = position && (position.x !== 0 || position.y !== 0);
  const isContainer = [
    "beaker",
    "flask",
    "burette",
    "erlenmeyer_flask",
    "conical_flask",
    "test_tubes",
    "beakers",
  ].includes(id);

  // Calculate mixed color from all chemicals
  const getMixedColor = () => {
    if (chemicals.length === 0) return "transparent";
    if (chemicals.length === 1) return chemicals[0].color;

    // Enhanced color mixing for chemical reactions
    const chemicalIds = chemicals.map((c) => c.id).sort();

    // Specific reaction colors
    if (chemicalIds.includes("hcl") && chemicalIds.includes("naoh")) {
      if (chemicalIds.includes("phenol")) {
        return "#FFB6C1"; // Pink when phenolphthalein is added to basic solution
      }
      return "#E8F5E8"; // Light green for neutralization
    }

    if (chemicalIds.includes("phenol") && chemicalIds.includes("naoh")) {
      return "#FF69B4"; // Bright pink
    }

    // Default color mixing
    let r = 0,
      g = 0,
      b = 0,
      totalAmount = 0;

    chemicals.forEach((chemical) => {
      const color = chemical.color;
      const amount = chemical.amount;

      const hex = color.replace("#", "");
      const rVal = parseInt(hex.substr(0, 2), 16);
      const gVal = parseInt(hex.substr(2, 2), 16);
      const bVal = parseInt(hex.substr(4, 2), 16);

      r += rVal * amount;
      g += gVal * amount;
      b += bVal * amount;
      totalAmount += amount;
    });

    if (totalAmount === 0) return "transparent";

    r = Math.round(r / totalAmount);
    g = Math.round(g / totalAmount);
    b = Math.round(b / totalAmount);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getSolutionHeight = () => {
    const totalVolume = chemicals.reduce(
      (sum, chemical) => sum + chemical.amount,
      0,
    );
    return Math.min(85, (totalVolume / 100) * 85);
  };

  const getEquipmentSpecificRendering = () => {
    if (id === "burette" && isOnWorkbench) {
      return (
        <div className="relative">
          {/* Burette specific rendering */}
          <div className="w-6 h-20 bg-gradient-to-b from-transparent to-blue-100 border-2 border-blue-400 rounded-b-lg relative">
            {/* Solution in burette */}
            {chemicals.length > 0 && (
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-500"
                style={{
                  backgroundColor: getMixedColor(),
                  height: `${getSolutionHeight()}%`,
                  opacity: 0.8,
                }}
              >
                {/* Liquid surface animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30 animate-pulse"></div>
              </div>
            )}

            {/* Volume markings */}
            <div className="absolute -right-8 top-2 text-xs text-gray-600">
              50
            </div>
            <div className="absolute -right-8 top-8 text-xs text-gray-600">
              40
            </div>
            <div className="absolute -right-8 top-14 text-xs text-gray-600">
              30
            </div>

            {/* Burette tap */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>

          {/* Drop animation when chemicals are added */}
          {isDropping && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      );
    }

    if (id === "erlenmeyer_flask" && isOnWorkbench) {
      return (
        <div className="relative">
          {/* Enhanced Erlenmeyer Flask Illustration */}
          <svg
            width="80"
            height="100"
            viewBox="0 0 80 100"
            className="drop-shadow-lg"
          >
            {/* Flask body */}
            <path
              d="M25 20 L25 35 L10 70 L70 70 L55 35 L55 20 Z"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#2563eb"
              strokeWidth="2"
            />
            {/* Flask neck */}
            <rect
              x="30"
              y="10"
              width="20"
              height="15"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#2563eb"
              strokeWidth="2"
              rx="2"
            />
            {/* Flask opening */}
            <ellipse
              cx="40"
              cy="10"
              rx="10"
              ry="2"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />

            {/* Solution in flask */}
            {chemicals.length > 0 && (
              <path
                d={`M${15 + chemicals.length * 2} ${70 - getSolutionHeight() * 0.4} L${65 - chemicals.length * 2} ${70 - getSolutionHeight() * 0.4} L70 70 L10 70 Z`}
                fill={getMixedColor()}
                opacity="0.8"
                className="transition-all duration-500"
              />
            )}

            {/* Volume markings */}
            <g stroke="#6b7280" strokeWidth="1" fill="#6b7280">
              <line x1="72" y1="50" x2="75" y2="50" />
              <text x="78" y="53" fontSize="6">
                100mL
              </text>
              <line x1="72" y1="60" x2="75" y2="60" />
              <text x="78" y="63" fontSize="6">
                50mL
              </text>
            </g>

            {/* Bubbling animation for reactions */}
            {chemicals.length > 1 && (
              <g>
                {[...Array(6)].map((_, i) => (
                  <circle
                    key={i}
                    cx={25 + i * 8}
                    cy={65 - (i % 2) * 5}
                    r="1.5"
                    fill="rgba(255, 255, 255, 0.7)"
                    className="animate-bounce"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: "1.5s",
                    }}
                  />
                ))}
              </g>
            )}

            {/* Flask label */}
            <text
              x="40"
              y="85"
              textAnchor="middle"
              fontSize="8"
              fill="#374151"
              fontWeight="bold"
            >
              125mL Erlenmeyer
            </text>
          </svg>

          {/* Chemical composition display */}
          {chemicals.length > 0 && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow-lg">
              <div className="text-gray-800 font-medium text-center">
                {chemicals.map((c) => c.name.split(" ")[0]).join(" + ")}
              </div>
              <div className="text-gray-600 text-center">
                {chemicals.reduce((sum, c) => sum + c.amount, 0).toFixed(1)} mL
                total
              </div>
            </div>
          )}

          {/* Drop success animation */}
          {isDropping && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                ✓ Added!
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        {icon}

        {/* Solution visualization for other containers */}
        {isContainer &&
          chemicals.length > 0 &&
          isOnWorkbench &&
          id !== "erlenmeyer_flask" && (
            <div className="absolute inset-0 flex items-end justify-center">
              <div
                className="rounded-b-lg transition-all duration-500 opacity-80"
                style={{
                  backgroundColor: getMixedColor(),
                  height: `${getSolutionHeight()}%`,
                  width: id === "beaker" ? "70%" : "60%",
                  minHeight: "8px",
                }}
              >
                {/* Enhanced liquid effects */}
                <div className="relative w-full h-full overflow-hidden rounded-b-lg">
                  {/* Surface shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-40 animate-pulse"></div>

                  {/* Bubbling animation for reactions */}
                  {chemicals.length > 1 && (
                    <div className="absolute inset-0">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white opacity-70 rounded-full animate-bounce"
                          style={{
                            left: `${15 + i * 20}%`,
                            bottom: `${5 + (i % 2) * 15}px`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: "1.5s",
                          }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* Color change animation */}
                  {chemicals.some((c) => c.id === "phenol") &&
                    chemicals.some((c) => c.id === "naoh") && (
                      <div className="absolute inset-0 bg-pink-300 opacity-50 animate-pulse rounded-b-lg"></div>
                    )}
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={isContainer ? handleChemicalDragOver : undefined}
      onDragLeave={isContainer ? handleChemicalDragLeave : undefined}
      onDrop={isContainer ? handleChemicalDrop : undefined}
      className={`flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing border-2 relative ${
        isOnWorkbench
          ? "border-blue-400 bg-blue-50"
          : "border-gray-200 hover:border-blue-400"
      } ${isContainer && isDragOver ? "border-green-500 bg-green-50 scale-105" : ""} ${
        isDropping ? "animate-pulse" : ""
      }`}
      style={{
        position: isOnWorkbench ? "absolute" : "relative",
        left: isOnWorkbench && position ? position.x : "auto",
        top: isOnWorkbench && position ? position.y : "auto",
        zIndex: isOnWorkbench ? 10 : "auto",
        transform: isOnWorkbench ? "translate(-50%, -50%)" : "none",
      }}
    >
      {/* Enhanced drop zone indicator */}
      {isContainer && isOnWorkbench && (
        <div
          className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isDragOver ? "bg-green-500 scale-125 shadow-lg" : "bg-blue-500"
          }`}
        >
          <Droplet size={14} className="text-white" />
          {isDragOver && (
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
          )}
        </div>
      )}

      {/* Drop hint text */}
      {isContainer && isOnWorkbench && isDragOver && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium animate-bounce whitespace-nowrap shadow-lg">
          Drop chemical here!
        </div>
      )}

      {/* Drag over animation */}
      {isDragOver && (
        <div className="absolute inset-0 border-4 border-green-400 rounded-lg animate-pulse bg-green-100 opacity-50"></div>
      )}

      <div
        className={`mb-3 transition-all duration-200 relative ${
          isOnWorkbench ? "text-blue-700" : "text-blue-600"
        } ${isDragOver ? "scale-110" : ""}`}
      >
        {getEquipmentSpecificRendering()}
      </div>

      <span
        className={`text-sm font-semibold text-center transition-colors ${
          isOnWorkbench ? "text-blue-800" : "text-gray-700"
        } ${isDragOver ? "text-green-700" : ""}`}
      >
        {name}
      </span>

      {/* Enhanced chemical composition display */}
      {chemicals.length > 0 && isOnWorkbench && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-xs shadow-lg min-w-max">
          <div className="text-gray-800 font-medium">
            {chemicals
              .map((chemical) => chemical.name.split(" ")[0])
              .join(" + ")}
          </div>
          <div className="text-gray-600 text-center">
            {chemicals
              .reduce((sum, chemical) => sum + chemical.amount, 0)
              .toFixed(1)}{" "}
            mL
          </div>
          {/* Color indicator */}
          <div
            className="w-full h-1 rounded-full mt-1"
            style={{ backgroundColor: getMixedColor() }}
          ></div>
        </div>
      )}

      {/* Drop success animation */}
      {isDropping && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-bounce">
            Added!
          </div>
        </div>
      )}
    </div>
  );
};

export const equipmentList = [
  { id: "beaker", name: "Beaker", icon: <Beaker size={36} /> },
  { id: "flask", name: "Erlenmeyer Flask", icon: <FlaskConical size={36} /> },
  { id: "burette", name: "Burette", icon: <TestTube size={36} /> },
  { id: "thermometer", name: "Thermometer", icon: <Thermometer size={36} /> },
];
