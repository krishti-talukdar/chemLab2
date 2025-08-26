import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { X, TestTube, Beaker, Droplets } from "lucide-react";

interface EquipmentProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  onDrag?: (id: string, x: number, y: number) => void;
  position?: { x: number; y: number } | null;
  onRemove?: (id: string) => void;
  disabled?: boolean;
  color?: string;
  volume?: number;
  onInteract?: (id: string) => void;
  isActive?: boolean;
}

export const Equipment: React.FC<EquipmentProps> = ({
  id,
  name,
  icon,
  onDrag,
  position,
  onRemove,
  disabled = false,
  color = "#e5e7eb",
  volume = 0,
  onInteract,
  isActive = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    e.dataTransfer.setData("equipment", id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (onInteract && position) {
      onInteract(id);
    }
  };

  // Render toolbar version (draggable source)
  if (!position) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable={!disabled}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
              flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
              ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
              ${disabled 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg hover:scale-105'
              }
            `}
          >
            <div className="text-3xl mb-2 text-blue-600">
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">
              {name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Drag to workbench: {name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Render workbench version (positioned equipment)
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      className="relative group"
    >
      {/* Equipment container */}
      <div
        className={`relative bg-white rounded-xl shadow-lg border-2 p-4 transition-all duration-200 cursor-pointer ${
          isActive ? 'border-blue-400 shadow-xl scale-105' : 'border-gray-200 hover:border-gray-300'
        } ${id === 'test-tube' ? 'min-w-[120px] min-h-[180px]' : 'min-w-[90px] min-h-[120px]'}`}
        onClick={handleClick}
      >
        {/* Remove button */}
        {onRemove && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            size="sm"
            variant="outline"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white border-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {/* Equipment visual based on type */}
        <div className="flex flex-col items-center">
          {id === 'test-tube' ? (
            <div className="relative">
              <div className="relative w-12 h-28">
                {/* Test tube image */}
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fabfa12ceeba14d95b00014fbc7d41d9a%2Fce67a26571c44f31b921fd4e88ba3830?format=webp&width=800"
                  alt="Test tube"
                  className="w-full h-full object-contain"
                />
                {/* Pink liquid overlay when volume > 0 */}
                {volume > 0 && (
                  <div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 rounded-b-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(15, (volume / 100) * 80)}px`,
                      backgroundColor: color,
                      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                      opacity: 0.9
                    }}
                  />
                )}
              </div>
              <span className="text-xs font-medium mt-1 text-center block">{name}</span>
              {volume > 0 && (
                <span className="text-xs text-gray-600 text-center block">{Math.round(volume)}% full</span>
              )}
            </div>
          ) : id === 'distilled-water' ? (
            <div className="flex flex-col items-center">
              <div
                className="w-14 h-20 rounded-lg border-2 border-gray-300 relative overflow-hidden mb-2 shadow-sm"
                style={{ backgroundColor: '#e0f2fe' }}
              >
                <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-blue-200 to-transparent opacity-60"></div>
                <Beaker className="w-7 h-7 absolute top-2 left-1/2 transform -translate-x-1/2 text-blue-600 opacity-50" />
              </div>
              <span className="text-xs font-medium text-center">{name}</span>
              <span className="text-xs text-blue-600 font-semibold">H₂O</span>
            </div>
          ) : id === 'concentrated-hcl' ? (
            <div className="flex flex-col items-center">
              <div
                className="w-14 h-20 rounded-lg border-2 border-gray-300 relative overflow-hidden mb-2 shadow-sm"
                style={{ backgroundColor: '#fffacd' }}
              >
                <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-yellow-200 to-transparent opacity-60"></div>
                <Droplets className="w-7 h-7 absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-600 opacity-50" />
              </div>
              <span className="text-xs font-medium text-center">{name}</span>
              <span className="text-xs text-yellow-600 font-semibold">HCl (12M)</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2 text-blue-600">
                {icon}
              </div>
              <span className="text-xs font-medium text-center">{name}</span>
            </div>
          )}
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-0 border-2 border-blue-400 rounded-xl animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

// Equipment definitions
export const LAB_EQUIPMENT = [
  {
    id: 'test-tube',
    name: 'Test Tube',
    icon: <TestTube className="w-8 h-8" />,
    description: 'Glass test tube for reactions'
  },
  {
    id: 'distilled-water',
    name: 'Distilled Water',
    icon: <Beaker className="w-8 h-8" />,
    description: 'Pure H₂O for dilution'
  },
  {
    id: 'concentrated-hcl',
    name: 'Concentrated HCl',
    icon: <Droplets className="w-8 h-8" />,
    description: 'Hydrochloric acid (12M)'
  }
];
