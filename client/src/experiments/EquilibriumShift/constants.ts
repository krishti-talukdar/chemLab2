import { ReagentBottle, TestTube, EquilibriumState } from "./types";

// Color constants for the equilibrium system
export const COLORS = {
  PINK: '#ffb6c1',      // [Co(H₂O)₆]²⁺ - hydrated complex
  PURPLE: '#9370db',     // Transition state
  BLUE: '#4682b4',       // [CoCl₄]²⁻ - chloride complex
  CLEAR: '#f0f8ff',      // Water/neutral
  HCL: '#fffacd'         // HCl solution (pale yellow)
} as const;

// Reagent bottles data
export const REAGENT_BOTTLES: ReagentBottle[] = [
  {
    id: 'hcl',
    name: 'Concentrated HCl',
    formula: 'HCl (12M)',
    color: COLORS.HCL,
    description: 'Adds Cl⁻ ions → shifts equilibrium right → blue color',
    concentration: '12.0 M'
  },
  {
    id: 'water',
    name: 'Distilled Water',
    formula: 'H₂O',
    color: COLORS.CLEAR,
    description: 'Dilutes Cl⁻ ions → shifts equilibrium left → pink color',
    concentration: 'Pure'
  }
];

// Initial test tube state
export const INITIAL_TESTTUBE: TestTube = {
  id: 'main-tube',
  volume: 10, // mL
  color: 'Pink',
  colorHex: COLORS.PINK,
  contents: ['CoCl₂', 'H₂O'],
  temperature: 25 // °C
};

// Equilibrium states mapping
export const EQUILIBRIUM_STATES: Record<string, EquilibriumState> = {
  hydrated: {
    dominantComplex: 'hydrated',
    colorHex: COLORS.PINK,
    explanation: 'Predominant complex: [Co(H₂O)₆]²⁺ (pink). Low Cl⁻ concentration favors the hydrated form.',
    equilibriumDirection: 'left'
  },
  transition: {
    dominantComplex: 'transition',
    colorHex: COLORS.PURPLE,
    explanation: 'Equilibrium shifting. Both complexes present in significant amounts.',
    equilibriumDirection: 'neutral'
  },
  chloride: {
    dominantComplex: 'chloride',
    colorHex: COLORS.BLUE,
    explanation: 'Predominant complex: [CoCl₄]²⁻ (blue). High Cl⁻ concentration favors the chloride form.',
    equilibriumDirection: 'right'
  }
};

// Guided mode step instructions
export const GUIDED_STEPS = [
  "Observe the initial pink solution containing [Co(H₂O)₆]²⁺ complex in the test tube.",
  "Click 'Add HCl' to introduce Cl⁻ ions and watch the equilibrium shift right.",
  "Observe the gradual color change from pink → purple → blue as [CoCl₄]²⁻ forms.",
  "Click 'Add Water' to dilute the Cl⁻ concentration and shift equilibrium left.",
  "Watch the color change back from blue → purple → pink as [Co(H₂O)₆]²⁺ reforms.",
  "Experiment freely by alternating additions to observe Le Chatelier's principle!"
];

// Animation durations (in milliseconds)
export const ANIMATION = {
  DROPPER_DURATION: 1500,
  COLOR_TRANSITION_DURATION: 2000,
  BUBBLE_EFFECT_DURATION: 1000,
  EXPLANATION_UPDATE_DELAY: 500
} as const;

// Lab equipment positions (relative to container)
export const EQUIPMENT_POSITIONS = {
  TEST_TUBE: { x: 50, y: 40 },
  HCL_BOTTLE: { x: 15, y: 20 },
  WATER_BOTTLE: { x: 85, y: 20 },
  EXPLANATION_PANEL: { x: 20, y: 75 }
} as const;

// Equilibrium equation
export const EQUILIBRIUM_EQUATION = {
  reactants: '[Co(H₂O)₆]²⁺ + 4Cl⁻',
  products: '[CoCl₄]²⁻ + 6H₂O',
  colors: {
    left: 'pink',
    right: 'blue'
  }
} as const;
