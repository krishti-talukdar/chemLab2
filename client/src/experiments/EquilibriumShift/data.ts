const EquilibriumShiftData = {
  id: 5,
  title: "Equilibrium Shift: [Co(H₂O)₆]²⁺ vs Cl⁻ Ions",
  description: "Interactive virtual lab to study equilibrium shifts between cobalt complexes. Observe dramatic color changes from pink to blue as you add HCl or water, demonstrating Le Chatelier's principle in real-time.",
  category: "Chemical Equilibrium",
  difficulty: "Intermediate",
  duration: 25,
  steps: 6,
  rating: 4.9,
  imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
  equipment: [
    "Test Tube",
    "Reagent Bottles",
    "Graduated Droppers", 
    "Stirring Rod",
    "Thermometer",
    "Color Chart"
  ],
  stepDetails: [
    {
      id: 1,
      title: "Observe Initial State",
      description: "Examine the pink solution in the test tube, representing the [Co(H₂O)₆]²⁺ hydrated complex. Note the equilibrium equation displayed.",
      duration: "2 minutes",
      temperature: "Room temperature",
      completed: false
    },
    {
      id: 2,
      title: "Add Concentrated HCl",
      description: "Click the HCl reagent bottle twice. First click: observe pink to purple transition. Second click: complete the shift from purple to blue as Cl⁻ ions fully shift equilibrium right.",
      duration: "4 minutes",
      safety: "HCl is corrosive - handle with care",
      completed: false
    },
    {
      id: 3,
      title: "Observe Blue Complex",
      description: "Study the blue [CoCl₄]²⁻ complex that forms. Read the dynamic explanation panel to understand the equilibrium shift.",
      duration: "3 minutes",
      completed: false
    },
    {
      id: 4,
      title: "Add Distilled Water",
      description: "Click the water bottle twice. First click: observe blue to purple transition. Second click: complete the reverse shift from purple to pink as dilution shifts equilibrium left.",
      duration: "4 minutes",
      completed: false
    },
    {
      id: 5,
      title: "Repeat and Experiment",
      description: "Alternate between adding HCl and water to observe multiple equilibrium shifts. Notice the smooth color transitions and timing.",
      duration: "8 minutes",
      completed: false
    },
    {
      id: 6,
      title: "Step-by-Step Mode",
      description: "Use guided mode for structured learning with detailed instructions at each step. Perfect for understanding the underlying chemistry.",
      duration: "4 minutes",
      completed: false
    }
  ],
  safetyInfo: "This is a virtual simulation. In real lab conditions: Concentrated HCl is highly corrosive and produces toxic vapors. Cobalt compounds are toxic and potentially carcinogenic. Always use proper ventilation, safety goggles, and gloves. Handle all chemicals in a fume hood."
};

export default EquilibriumShiftData;
