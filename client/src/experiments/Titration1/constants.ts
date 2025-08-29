import React from "react";
import { Beaker, FlaskConical, Pipette, Filter, TestTube } from "lucide-react";
import type { Chemical, Equipment } from "./types";

// Chemical reagents for Titration 1 experiment
export const TITRATION_CHEMICALS: Chemical[] = [
  {
    id: "oxalic_acid_std",
    name: "0.1N Oxalic Acid",
    formula: "H₂C₂O₄",
    color: "#F0F8FF",
    concentration: "0.1N",
    volume: 25,
    molecularWeight: 90.03,
  },
  {
    id: "naoh_solution",
    name: "NaOH Solution",
    formula: "NaOH",
    color: "#E6F3FF",
    concentration: "Unknown",
    volume: 50,
    molecularWeight: 40.00,
  },
  {
    id: "distilled_water",
    name: "Distilled Water",
    formula: "H₂O",
    color: "#87CEEB",
    concentration: "Pure",
    volume: 500,
  },
  {
    id: "phenolphthalein",
    name: "Phenolphthalein Indicator",
    formula: "C₂₀H₁₄O₄",
    color: "#FFB6C1",
    concentration: "1% solution",
    volume: 10,
  },
];

// Equipment for Titration 1 workspace
export const TITRATION_EQUIPMENT: Equipment[] = [
  {
    id: "burette",
    name: "Burette",
    capacity: "50 mL",
    icon: React.createElement(
      "svg",
      {
        width: "36",
        height: "36",
        viewBox: "0 0 36 36",
        fill: "none",
        className: "text-blue-600",
      },
      [
        React.createElement("rect", {
          key: "tube",
          x: "14",
          y: "4",
          width: "8",
          height: "28",
          stroke: "currentColor",
          strokeWidth: "2",
          fill: "rgba(59, 130, 246, 0.1)",
        }),
        React.createElement("path", {
          key: "graduations",
          d: "M14 8h4 M14 12h4 M14 16h4 M14 20h4 M14 24h4 M14 28h4",
          stroke: "currentColor",
          strokeWidth: "1",
        }),
        React.createElement("circle", {
          key: "stopcock",
          cx: "18",
          cy: "30",
          r: "2",
          fill: "currentColor",
        }),
        React.createElement("path", {
          key: "tip",
          d: "M17 32v2",
          stroke: "currentColor",
          strokeWidth: "2",
        }),
      ],
    ),
    description: "50 mL graduated burette for precise volume measurement",
  },
  {
    id: "pipette",
    name: "Pipette",
    capacity: "25 mL",
    icon: React.createElement(Pipette, { size: 36, className: "text-green-600" }),
    description: "25 mL volumetric pipette for accurate liquid transfer",
  },
  {
    id: "conical_flask",
    name: "Conical Flask",
    capacity: "250 mL",
    icon: React.createElement(FlaskConical, { size: 36, className: "text-gray-600" }),
    description: "250 mL conical flask for titration reactions",
  },
  {
    id: "funnel",
    name: "Funnel",
    icon: React.createElement(Filter, { size: 36, className: "text-yellow-600" }),
    description: "Glass funnel for safe liquid transfer",
  },
  {
    id: "wash_bottle",
    name: "Wash Bottle",
    icon: React.createElement(
      "svg",
      {
        width: "36",
        height: "36",
        viewBox: "0 0 36 36",
        fill: "none",
        className: "text-blue-500",
      },
      [
        React.createElement("path", {
          key: "bottle",
          d: "M12 10h12v18a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V10z",
          stroke: "currentColor",
          strokeWidth: "2",
          fill: "rgba(59, 130, 246, 0.1)",
        }),
        React.createElement("path", {
          key: "neck",
          d: "M16 10V8a2 2 0 0 1 4 0v2",
          stroke: "currentColor",
          strokeWidth: "2",
        }),
        React.createElement("path", {
          key: "spout",
          d: "M18 8l8-2",
          stroke: "currentColor",
          strokeWidth: "2",
        }),
        React.createElement("path", {
          key: "water",
          d: "M14 12h8v14H14z",
          fill: "rgba(59, 130, 246, 0.3)",
        }),
      ],
    ),
    description: "Distilled water wash bottle for rinsing equipment",
  },
  {
    id: "burette_stand",
    name: "Burette Stand",
    icon: React.createElement(
      "svg",
      {
        width: "36",
        height: "36",
        viewBox: "0 0 36 36",
        fill: "none",
        className: "text-gray-700",
      },
      [
        React.createElement("path", {
          key: "base",
          d: "M8 32h20v2H8z",
          stroke: "currentColor",
          strokeWidth: "2",
          fill: "currentColor",
        }),
        React.createElement("path", {
          key: "pole",
          d: "M18 32V4",
          stroke: "currentColor",
          strokeWidth: "3",
        }),
        React.createElement("path", {
          key: "clamp",
          d: "M16 12h6v4h-6z",
          stroke: "currentColor",
          strokeWidth: "2",
          fill: "rgba(107, 114, 128, 0.2)",
        }),
      ],
    ),
    description: "Metal stand with clamp for securing burette",
  },
  {
    id: "white_tile",
    name: "White Tile",
    icon: React.createElement(
      "svg",
      {
        width: "36",
        height: "36",
        viewBox: "0 0 36 36",
        fill: "none",
        className: "text-gray-400",
      },
      [
        React.createElement("rect", {
          key: "tile",
          x: "6",
          y: "14",
          width: "24",
          height: "16",
          stroke: "currentColor",
          strokeWidth: "2",
          fill: "rgba(255, 255, 255, 0.9)",
        }),
      ],
    ),
    description: "White background tile for better endpoint visibility",
  },
  {
    id: "beaker_100ml",
    name: "Beaker (100 mL)",
    capacity: "100 mL",
    icon: React.createElement(Beaker, { size: 36, className: "text-blue-400" }),
    description: "100 mL beaker for solution preparation",
  },
];

// Titration procedure steps
export const TITRATION_STEPS = [
  {
    id: 1,
    title: "Setup Workspace",
    description: "Arrange all equipment on the lab bench in proper order",
  },
  {
    id: 2,
    title: "Prepare Burette",
    description: "Rinse burette with distilled water, then with NaOH solution",
  },
  {
    id: 3,
    title: "Fill Burette",
    description: "Fill burette with NaOH solution and adjust to zero mark",
  },
  {
    id: 4,
    title: "Prepare Analyte",
    description: "Transfer 25.0 mL of 0.1N oxalic acid to conical flask",
  },
  {
    id: 5,
    title: "Add Indicator",
    description: "Add 2-3 drops of phenolphthalein indicator",
  },
  {
    id: 6,
    title: "Perform Titration",
    description: "Titrate until permanent pink endpoint is reached",
  },
  {
    id: 7,
    title: "Record Results",
    description: "Note final burette reading and calculate titre volume",
  },
  {
    id: 8,
    title: "Repeat Analysis",
    description: "Perform concordant titrations for accuracy",
  },
];

// Safety guidelines for titration
export const SAFETY_GUIDELINES = [
  "Always wear safety goggles and gloves",
  "Handle NaOH solution with extreme care - it's highly corrosive",
  "Oxalic acid is toxic - avoid skin contact and inhalation",
  "Work in a well-ventilated area",
  "Keep wash bottle nearby for emergency rinsing",
  "Report any spills or accidents immediately",
  "Wash hands thoroughly after the experiment",
];

// Calculation formulas for titration
export const TITRATION_FORMULAS = [
  {
    name: "Normality Calculation",
    formula: "N₁V₁ = N₂V₂",
    description: "N₁V₁ (oxalic acid) = N₂V₂ (NaOH)",
  },
  {
    name: "Strength Calculation",
    formula: "Strength (g/L) = Normality × Equivalent Weight",
    description: "For NaOH: Equivalent Weight = 40 g/mol",
  },
  {
    name: "Molarity Relationship",
    formula: "Molarity = Normality / n-factor",
    description: "For NaOH (monoacidic): n-factor = 1",
  },
];

// Default experimental conditions
export const DEFAULT_CONDITIONS = {
  temperature: 25, // °C
  pressure: 1, // atm
  oxalicAcidVolume: 25.0, // mL
  oxalicAcidNormality: 0.1, // N
  indicatorDrops: 3,
  expectedTitreVolume: 25.0, // mL (if NaOH is also 0.1N)
};
