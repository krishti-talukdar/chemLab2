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
    if (!isOnWorkbench) {
      return icon; // Use simple icons when not on workbench
    }

    // Realistic equipment renderings for workbench
    if (id === "burette") {
      return (
        <div className="relative">
          <svg
            width="60"
            height="160"
            viewBox="0 0 60 160"
            className="drop-shadow-lg"
          >
            {/* Burette body */}
            <defs>
              <linearGradient
                id="glassGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="50%" stopColor="rgba(240,248,255,0.8)" />
                <stop offset="100%" stopColor="rgba(219,234,254,0.9)" />
              </linearGradient>
              <linearGradient
                id="liquidGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.9"
                />
                <stop
                  offset="50%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.9"
                />
              </linearGradient>
            </defs>

            {/* Main burette tube */}
            <rect
              x="20"
              y="10"
              width="20"
              height="120"
              fill="url(#glassGradient)"
              stroke="#94a3b8"
              strokeWidth="1.5"
              rx="2"
            />

            {/* Burette top opening */}
            <ellipse
              cx="30"
              cy="10"
              rx="10"
              ry="3"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Volume markings */}
            <g
              stroke="#6b7280"
              strokeWidth="0.8"
              fill="#4b5563"
              fontSize="6"
              fontFamily="monospace"
            >
              <line x1="42" y1="20" x2="45" y2="20" />
              <text x="47" y="23">
                50
              </text>
              <line x1="42" y1="40" x2="44" y2="40" />
              <line x1="42" y1="50" x2="45" y2="50" />
              <text x="47" y="53">
                40
              </text>
              <line x1="42" y1="70" x2="44" y2="70" />
              <line x1="42" y1="80" x2="45" y2="80" />
              <text x="47" y="83">
                30
              </text>
              <line x1="42" y1="100" x2="44" y2="100" />
              <line x1="42" y1="110" x2="45" y2="110" />
              <text x="47" y="113">
                20
              </text>
              <line x1="42" y1="125" x2="45" y2="125" />
              <text x="47" y="128">
                10
              </text>
            </g>

            {/* Solution in burette */}
            {chemicals.length > 0 && (
              <rect
                x="22"
                y={130 - getSolutionHeight()}
                width="16"
                height={getSolutionHeight()}
                fill="url(#liquidGradient)"
                rx="1"
                className="transition-all duration-500"
              >
                {/* Liquid surface */}
                <animate
                  attributeName="y"
                  values={`${130 - getSolutionHeight()};${128 - getSolutionHeight()};${130 - getSolutionHeight()}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </rect>
            )}

            {/* Glass shine effect */}
            <rect
              x="23"
              y="15"
              width="4"
              height="110"
              fill="rgba(255,255,255,0.4)"
              rx="2"
            />

            {/* Burette stopcock */}
            <rect
              x="25"
              y="135"
              width="10"
              height="8"
              fill="#6b7280"
              stroke="#4b5563"
              strokeWidth="1"
              rx="2"
            />
            <circle cx="30" cy="139" r="2" fill="#374151" />

            {/* Tip */}
            <path
              d="M28 143 L30 148 L32 143 Z"
              fill="url(#glassGradient)"
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* Drop animation */}
            {isDropping && (
              <circle
                cx="30"
                cy="150"
                r="1.5"
                fill={getMixedColor()}
                className="animate-bounce"
              />
            )}
          </svg>
        </div>
      );
    }

    if (id === "flask" || id === "erlenmeyer_flask") {
      return (
        <div className="relative">
          <svg
            width="100"
            height="140"
            viewBox="0 0 100 140"
            className="drop-shadow-lg"
          >
            <defs>
              <linearGradient
                id="flaskGlass"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="30%" stopColor="rgba(248,250,252,0.85)" />
                <stop offset="70%" stopColor="rgba(241,245,249,0.9)" />
                <stop offset="100%" stopColor="rgba(226,232,240,0.95)" />
              </linearGradient>
              <linearGradient
                id="flaskLiquid"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.85"
                />
                <stop
                  offset="50%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.85"
                />
              </linearGradient>
            </defs>

            {/* Flask body - conical shape */}
            <path
              d="M35 30 L35 45 L15 105 L85 105 L65 45 L65 30 Z"
              fill="url(#flaskGlass)"
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* Flask neck */}
            <rect
              x="40"
              y="15"
              width="20"
              height="20"
              fill="url(#flaskGlass)"
              stroke="#94a3b8"
              strokeWidth="2"
              rx="3"
            />

            {/* Flask opening */}
            <ellipse
              cx="50"
              cy="15"
              rx="10"
              ry="3"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Volume markings */}
            <g
              stroke="#6b7280"
              strokeWidth="1"
              fill="#4b5563"
              fontSize="7"
              fontFamily="Arial"
            >
              <line x1="87" y1="65" x2="92" y2="65" />
              <text x="94" y="68">
                1000
              </text>
              <line x1="87" y1="75" x2="90" y2="75" />
              <line x1="87" y1="82" x2="92" y2="82" />
              <text x="94" y="85">
                800
              </text>
              <line x1="87" y1="89" x2="90" y2="89" />
              <line x1="87" y1="96" x2="92" y2="96" />
              <text x="94" y="99">
                600
              </text>
              <line x1="87" y1="100" x2="90" y2="100" />
              <text x="94" y="108">
                400
              </text>
            </g>

            {/* Label area */}
            <rect
              x="25"
              y="75"
              width="20"
              height="12"
              fill="rgba(255,255,255,0.9)"
              stroke="#d1d5db"
              strokeWidth="0.5"
              rx="2"
            />
            <text
              x="35"
              y="82"
              textAnchor="middle"
              fontSize="6"
              fill="#374151"
              fontWeight="bold"
            >
              1000ml
            </text>

            {/* Solution in flask */}
            {chemicals.length > 0 && (
              <path
                d={`M${20 + chemicals.length} ${105 - getSolutionHeight() * 0.6} L${80 - chemicals.length} ${105 - getSolutionHeight() * 0.6} L85 105 L15 105 Z`}
                fill="url(#flaskLiquid)"
                className="transition-all duration-500"
              />
            )}

            {/* Glass shine effects */}
            <ellipse
              cx="30"
              cy="55"
              rx="3"
              ry="15"
              fill="rgba(255,255,255,0.6)"
              opacity="0.8"
            />
            <ellipse
              cx="42"
              cy="25"
              rx="2"
              ry="8"
              fill="rgba(255,255,255,0.5)"
              opacity="0.7"
            />

            {/* Bubbling animation for reactions */}
            {chemicals.length > 1 && (
              <g>
                {[...Array(5)].map((_, i) => (
                  <circle
                    key={i}
                    cx={30 + i * 8}
                    cy={95 - (i % 2) * 8}
                    r="1.5"
                    fill="rgba(255,255,255,0.8)"
                    className="animate-bounce"
                    style={{
                      animationDelay: `${i * 0.4}s`,
                      animationDuration: "2s",
                    }}
                  />
                ))}
              </g>
            )}
          </svg>

          {/* Enhanced chemical composition display */}
          {chemicals.length > 0 && (
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg min-w-max">
              <div className="text-gray-800 font-semibold text-center">
                {chemicals.map((c) => c.name.split(" ")[0]).join(" + ")}
              </div>
              <div className="text-gray-600 text-center">
                {chemicals.reduce((sum, c) => sum + c.amount, 0).toFixed(1)} mL
                total
              </div>
              <div
                className="w-full h-1 rounded-full mt-1"
                style={{ backgroundColor: getMixedColor() }}
              ></div>
            </div>
          )}
        </div>
      );
    }

    if (id === "beaker") {
      return (
        <div className="relative">
          <svg
            width="80"
            height="120"
            viewBox="0 0 80 120"
            className="drop-shadow-lg"
          >
            <defs>
              <linearGradient
                id="beakerGlass"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="50%" stopColor="rgba(248,250,252,0.85)" />
                <stop offset="100%" stopColor="rgba(226,232,240,0.95)" />
              </linearGradient>
              <linearGradient
                id="beakerLiquid"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.85"
                />
                <stop
                  offset="50%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor={getMixedColor()}
                  stopOpacity="0.85"
                />
              </linearGradient>
            </defs>

            {/* Beaker body */}
            <rect
              x="15"
              y="25"
              width="50"
              height="75"
              fill="url(#beakerGlass)"
              stroke="#94a3b8"
              strokeWidth="2"
              rx="4"
            />

            {/* Beaker spout */}
            <path
              d="M62 35 Q68 35 68 40 Q68 45 62 45"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* Volume markings */}
            <g
              stroke="#6b7280"
              strokeWidth="1"
              fill="#4b5563"
              fontSize="7"
              fontFamily="Arial"
            >
              <line x1="67" y1="40" x2="72" y2="40" />
              <text x="74" y="43">
                500
              </text>
              <line x1="67" y1="55" x2="70" y2="55" />
              <line x1="67" y1="65" x2="72" y2="65" />
              <text x="74" y="68">
                400
              </text>
              <line x1="67" y1="75" x2="70" y2="75" />
              <line x1="67" y1="85" x2="72" y2="85" />
              <text x="74" y="88">
                300
              </text>
              <line x1="67" y1="90" x2="70" y2="90" />
              <text x="74" y="98">
                200
              </text>
            </g>

            {/* Solution in beaker */}
            {chemicals.length > 0 && (
              <rect
                x="18"
                y={95 - getSolutionHeight() * 0.8}
                width="44"
                height={getSolutionHeight() * 0.8 + 5}
                fill="url(#beakerLiquid)"
                rx="2"
                className="transition-all duration-500"
              />
            )}

            {/* Glass shine */}
            <rect
              x="20"
              y="30"
              width="6"
              height="60"
              fill="rgba(255,255,255,0.5)"
              rx="3"
              opacity="0.8"
            />

            {/* Base */}
            <ellipse
              cx="40"
              cy="105"
              rx="25"
              ry="4"
              fill="url(#beakerGlass)"
              stroke="#94a3b8"
              strokeWidth="1"
            />
          </svg>
        </div>
      );
    }

    if (id === "thermometer") {
      return (
        <div className="relative">
          <svg
            width="25"
            height="140"
            viewBox="0 0 25 140"
            className="drop-shadow-lg"
          >
            <defs>
              <linearGradient
                id="thermometerGlass"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="100%" stopColor="rgba(241,245,249,0.9)" />
              </linearGradient>
              <linearGradient id="mercury" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#f87171" />
              </linearGradient>
            </defs>

            {/* Thermometer tube */}
            <rect
              x="8"
              y="10"
              width="9"
              height="110"
              fill="url(#thermometerGlass)"
              stroke="#94a3b8"
              strokeWidth="1.5"
              rx="4"
            />

            {/* Mercury bulb */}
            <circle
              cx="12.5"
              cy="125"
              r="8"
              fill="url(#mercury)"
              stroke="#991b1b"
              strokeWidth="1"
            />

            {/* Mercury column */}
            <rect
              x="11"
              y="90"
              width="3"
              height="35"
              fill="url(#mercury)"
              rx="1.5"
            />

            {/* Temperature scale */}
            <g
              stroke="#4b5563"
              strokeWidth="0.5"
              fill="#374151"
              fontSize="5"
              fontFamily="Arial"
            >
              <line x1="18" y1="20" x2="21" y2="20" />
              <text x="22" y="22">
                100
              </text>
              <line x1="18" y1="35" x2="20" y2="35" />
              <line x1="18" y1="50" x2="21" y2="50" />
              <text x="22" y="52">
                50
              </text>
              <line x1="18" y1="65" x2="20" y2="65" />
              <line x1="18" y1="80" x2="21" y2="80" />
              <text x="22" y="82">
                0
              </text>
              <line x1="18" y1="95" x2="20" y2="95" />
              <line x1="18" y1="110" x2="21" y2="110" />
              <text x="22" y="112">
                -50
              </text>
            </g>

            {/* Glass shine */}
            <rect
              x="9"
              y="15"
              width="2"
              height="100"
              fill="rgba(255,255,255,0.6)"
              rx="1"
            />
          </svg>
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
      className={`flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing border-2 relative equipment-shadow ${
        isOnWorkbench
          ? "border-blue-400 bg-blue-50 equipment-glow"
          : "border-gray-200 hover:border-blue-400 hover:equipment-glow"
      } ${isContainer && isDragOver ? "border-green-500 bg-green-50 scale-105 drop-zone-active" : ""} ${
        isDropping ? "animate-pulse" : ""
      } hover:scale-105 active:scale-95 active:rotate-2`}
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
