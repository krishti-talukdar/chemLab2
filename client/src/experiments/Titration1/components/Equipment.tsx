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
    if (!disabled && onInteract && !isDragging) {
      onInteract(id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPositioned || disabled || !onReposition) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !onReposition) return;

      // Get workbench bounds
      const workbench = document.querySelector('[data-workbench="true"]');
      if (!workbench) return;

      const workbenchRect = workbench.getBoundingClientRect();
      const equipmentWidth = id === 'burette' ? 240 : 80;
      const equipmentHeight = id === 'burette' ? 420 : 80;
      const newX = Math.max(0, Math.min(e.clientX - workbenchRect.left - dragOffset.x, workbenchRect.width - equipmentWidth));
      const newY = Math.max(0, Math.min(e.clientY - workbenchRect.top - dragOffset.y, workbenchRect.height - equipmentHeight));

      setCurrentPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging && onReposition) {
        onReposition(id, currentPosition.x, currentPosition.y);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, currentPosition, id, onReposition]);

  const isPositioned = position !== undefined;
  const baseClasses = `
    flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
    ${isActive ? 'scale-105' : ''}
    ${isPositioned ? (
      id === 'burette'
        ? 'absolute min-w-[240px]'
        : 'absolute min-w-[80px] p-3 rounded-lg border-2 border-gray-200 bg-white'
    ) : 'w-full p-3 rounded-lg border-2 border-gray-200 bg-white'}
    ${!isPositioned && isActive ? 'border-blue-500 bg-blue-50' : ''}
  `;

  const equipmentElement = (
    <div
      className={`${baseClasses} ${isDragging ? 'cursor-grabbing z-50' : (isPositioned ? 'cursor-grab' : '')}`}
      style={isPositioned ? {
        left: currentPosition.x,
        top: currentPosition.y,
        transform: isActive ? 'scale(1.05)' : 'scale(1)'
      } : {}}
      draggable={!disabled && !isPositioned}
      onDragStart={handleDragStart}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
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

      {/* Drag indicator for burette */}
      {isPositioned && id === 'burette' && !isDragging && (
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}

      {/* Dragging overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded-lg animate-pulse"></div>
      )}

      {/* Equipment icon with custom styling for specific items */}
      <div className="relative">
        {id === 'burette' && isPositioned ? (
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fc52292a04d4c4255a87bdaa80a28beb9%2F73ac259c4cb845619a548dafd6799255?format=webp&width=800"
            alt="Burette with NaOH solution"
            className={`h-96 w-auto object-contain transition-transform duration-200 ${isActive ? 'scale-105' : ''}`}
            style={{ filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.15))' }}
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
              ? 'right-8 top-20 bg-white/90 backdrop-blur-sm shadow-md'
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
        {id === 'burette' && isPositioned ? (
          <div className="text-center">
            <div>Burette (50 mL NaOH)</div>
            <div className="text-xs text-gray-500 font-normal">Click & drag to move</div>
          </div>
        ) : name}
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
