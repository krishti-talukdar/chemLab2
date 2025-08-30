import React from "react";
import { X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Export LAB_EQUIPMENT for use in other components
export { LAB_EQUIPMENT } from "../constants";

interface EquipmentProps {
  id: string;
  name: string;
  icon: React.ReactElement;
  position?: { x: number; y: number };
  onRemove?: (id: string) => void;
  onInteract?: (id: string) => void;
  onReposition?: (id: string, x: number, y: number) => void;
  isActive?: boolean;
  disabled?: boolean;
  color?: string;
  volume?: number;
  reading?: number;
}

export const Equipment: React.FC<EquipmentProps> = ({
  id,
  name,
  icon,
  position,
  onRemove,
  onInteract,
  onReposition,
  isActive = false,
  disabled = false,
  color,
  volume,
  reading
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = React.useState(position || { x: 0, y: 0 });

  React.useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    }
  }, [position]);
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("equipment", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleClick = () => {
    if (!disabled && onInteract) {
      onInteract(id);
    }
  };

  const isPositioned = position !== undefined;
  const baseClasses = `
    flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
    ${isActive ? 'scale-105' : ''}
    ${isPositioned ? (
      id === 'burette'
        ? 'absolute min-w-[160px]'
        : 'absolute min-w-[80px] p-3 rounded-lg border-2 border-gray-200 bg-white'
    ) : 'w-full p-3 rounded-lg border-2 border-gray-200 bg-white'}
    ${!isPositioned && isActive ? 'border-blue-500 bg-blue-50' : ''}
  `;

  const equipmentElement = (
    <div
      className={baseClasses}
      style={position ? { 
        left: position.x, 
        top: position.y,
        transform: isActive ? 'scale(1.05)' : 'scale(1)'
      } : {}}
      draggable={!disabled && !isPositioned}
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {/* Remove button for positioned equipment */}
      {isPositioned && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Equipment icon with custom styling for specific items */}
      <div className="relative">
        {id === 'burette' && isPositioned ? (
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fc52292a04d4c4255a87bdaa80a28beb9%2F73ac259c4cb845619a548dafd6799255?format=webp&width=800"
            alt="Burette with NaOH solution"
            className={`h-80 w-auto object-contain transition-transform duration-200 ${isActive ? 'scale-105' : ''}`}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        ) : (
          React.cloneElement(icon, {
            className: `${icon.props.className} transition-transform duration-200 ${isActive ? 'scale-110' : ''}`,
            size: isPositioned ? 48 : 36
          })
        )}
        
        {/* Special rendering for different equipment types */}
        {id === 'conical-flask' && color && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, ${color} 60%)`,
              clipPath: 'polygon(30% 60%, 70% 60%, 65% 90%, 35% 90%)'
            }}
          />
        )}
        
        {id === 'burette' && (
          <div className={`absolute bg-white border rounded px-1 ${
            isPositioned
              ? 'right-4 top-12 bg-white/90 backdrop-blur-sm shadow-md'
              : 'right-0 top-0'
          }`}>
            <span className="text-xs font-mono font-semibold">{reading?.toFixed(1) || '0.0'} mL</span>
          </div>
        )}
        
        {volume !== undefined && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {Math.round(volume)}
          </div>
        )}
      </div>

      <span className={`text-center font-medium ${
        isPositioned
          ? (id === 'burette' ? 'text-xs font-semibold text-blue-700 mt-1' : 'text-xs mt-2')
          : 'text-sm mt-2'
      }`}>
        {id === 'burette' && isPositioned ? 'Burette (50 mL NaOH)' : name}
      </span>
      
      {!isPositioned && !disabled && (
        <span className="text-xs text-gray-500 mt-1">
          Drag to workbench
        </span>
      )}
    </div>
  );

  if (!isPositioned) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {equipmentElement}
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return equipmentElement;
};

export default Equipment;
