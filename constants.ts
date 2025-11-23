
import { Subject, Topic, TopicProgress, Status, Question } from './types';

// Comprehensive Syllabus Data simulating a 2-Year Coaching Structure (e.g., Bakliwal Tutorials)
export const SYLLABUS_DATA: Topic[] = [
  // --- PHASE 1: Foundation (Class 11 start) ---
  { id: 'p1-1', name: 'Units, Dimensions & Errors', subject: Subject.PHYSICS, phase: 1, estimatedHours: 8 },
  { id: 'p1-2', name: 'Kinematics (1D, 2D, Relative)', subject: Subject.PHYSICS, phase: 1, estimatedHours: 24 },
  { id: 'p1-3', name: 'Newton\'s Laws & Friction', subject: Subject.PHYSICS, phase: 1, estimatedHours: 20 },
  { id: 'c1-1', name: 'Mole Concept & Stoichiometry', subject: Subject.CHEMISTRY, phase: 1, estimatedHours: 18 },
  { id: 'c1-2', name: 'Atomic Structure', subject: Subject.CHEMISTRY, phase: 1, estimatedHours: 18 },
  { id: 'c1-3', name: 'Periodic Properties', subject: Subject.CHEMISTRY, phase: 1, estimatedHours: 12 },
  { id: 'm1-1', name: 'Basic Maths & Logarithms', subject: Subject.MATHS, phase: 1, estimatedHours: 12 },
  { id: 'm1-2', name: 'Quadratic Equations', subject: Subject.MATHS, phase: 1, estimatedHours: 18 },
  { id: 'm1-3', name: 'Sequence & Series (AP/GP/HP)', subject: Subject.MATHS, phase: 1, estimatedHours: 16 },

  // --- PHASE 2: Mechanics Core & Bonding (Class 11 mid) ---
  { id: 'p2-1', name: 'Work, Power & Energy', subject: Subject.PHYSICS, phase: 2, estimatedHours: 15 },
  { id: 'p2-2', name: 'Center of Mass & Collisions', subject: Subject.PHYSICS, phase: 2, estimatedHours: 16 },
  { id: 'p2-3', name: 'Rotational Mechanics', subject: Subject.PHYSICS, phase: 2, estimatedHours: 30 },
  { id: 'c2-1', name: 'Chemical Bonding', subject: Subject.CHEMISTRY, phase: 2, estimatedHours: 25 },
  { id: 'c2-2', name: 'Gaseous State', subject: Subject.CHEMISTRY, phase: 2, estimatedHours: 14 },
  { id: 'c2-3', name: 'Chemical Equilibrium', subject: Subject.CHEMISTRY, phase: 2, estimatedHours: 16 },
  { id: 'm2-1', name: 'Trigonometric Ratios & Identities', subject: Subject.MATHS, phase: 2, estimatedHours: 20 },
  { id: 'm2-2', name: 'Trigonometric Equations', subject: Subject.MATHS, phase: 2, estimatedHours: 10 },
  { id: 'm2-3', name: 'Solution of Triangles', subject: Subject.MATHS, phase: 2, estimatedHours: 12 },

  // --- PHASE 3: Matter, Thermo & Coordinate Geometry (Class 11 end) ---
  { id: 'p3-1', name: 'Gravitation', subject: Subject.PHYSICS, phase: 3, estimatedHours: 12 },
  { id: 'p3-2', name: 'Properties of Solids & Fluids', subject: Subject.PHYSICS, phase: 3, estimatedHours: 20 },
  { id: 'p3-3', name: 'Thermal Properties of Matter', subject: Subject.PHYSICS, phase: 3, estimatedHours: 10 },
  { id: 'p3-4', name: 'Thermodynamics (Physics)', subject: Subject.PHYSICS, phase: 3, estimatedHours: 14 },
  { id: 'p3-5', name: 'SHM (Simple Harmonic Motion)', subject: Subject.PHYSICS, phase: 3, estimatedHours: 16 },
  { id: 'p3-6', name: 'Waves & Sound', subject: Subject.PHYSICS, phase: 3, estimatedHours: 18 },
  { id: 'c3-1', name: 'Ionic Equilibrium', subject: Subject.CHEMISTRY, phase: 3, estimatedHours: 20 },
  { id: 'c3-2', name: 'Thermodynamics & Thermochemistry', subject: Subject.CHEMISTRY, phase: 3, estimatedHours: 20 },
  { id: 'c3-3', name: 'Redox Reactions', subject: Subject.CHEMISTRY, phase: 3, estimatedHours: 10 },
  { id: 'c3-4', name: 'Hydrogen & s-Block Elements', subject: Subject.CHEMISTRY, phase: 3, estimatedHours: 15 },
  { id: 'c3-5', name: 'p-Block (Group 13-14)', subject: Subject.CHEMISTRY, phase: 3, estimatedHours: 12 },
  { id: 'm3-1', name: 'Straight Lines & Pair of Lines', subject: Subject.MATHS, phase: 3, estimatedHours: 20 },
  { id: 'm3-2', name: 'Circles', subject: Subject.MATHS, phase: 3, estimatedHours: 18 },
  { id: 'm3-3', name: 'Parabola', subject: Subject.MATHS, phase: 3, estimatedHours: 12 },
  { id: 'm3-4', name: 'Ellipse & Hyperbola', subject: Subject.MATHS, phase: 3, estimatedHours: 16 },
  { id: 'm3-5', name: 'Binomial Theorem', subject: Subject.MATHS, phase: 3, estimatedHours: 14 },
  { id: 'm3-6', name: 'Permutation & Combination', subject: Subject.MATHS, phase: 3, estimatedHours: 18 },

  // --- PHASE 4: Electrodynamics & Organic Start (Class 12 start) ---
  { id: 'p4-1', name: 'Electrostatics', subject: Subject.PHYSICS, phase: 4, estimatedHours: 26 },
  { id: 'p4-2', name: 'Capacitors', subject: Subject.PHYSICS, phase: 4, estimatedHours: 12 },
  { id: 'p4-3', name: 'Current Electricity', subject: Subject.PHYSICS, phase: 4, estimatedHours: 20 },
  { id: 'c4-1', name: 'GOC (General Organic Chemistry)', subject: Subject.CHEMISTRY, phase: 4, estimatedHours: 28 },
  { id: 'c4-2', name: 'Isomerism', subject: Subject.CHEMISTRY, phase: 4, estimatedHours: 14 },
  { id: 'c4-3', name: 'Hydrocarbons', subject: Subject.CHEMISTRY, phase: 4, estimatedHours: 18 },
  { id: 'c4-4', name: 'Environmental Chemistry', subject: Subject.CHEMISTRY, phase: 4, estimatedHours: 6 },
  { id: 'm4-1', name: 'Set, Relations & Functions', subject: Subject.MATHS, phase: 4, estimatedHours: 20 },
  { id: 'm4-2', name: 'Inverse Trigonometric Functions', subject: Subject.MATHS, phase: 4, estimatedHours: 12 },
  { id: 'm4-3', name: 'Limits, Continuity & Differentiability', subject: Subject.MATHS, phase: 4, estimatedHours: 22 },
  { id: 'm4-4', name: 'Differentiation (Methods)', subject: Subject.MATHS, phase: 4, estimatedHours: 15 },

  // --- PHASE 5: Electromagnetism & Calculus (Class 12 mid) ---
  { id: 'p5-1', name: 'Moving Charges & Magnetism', subject: Subject.PHYSICS, phase: 5, estimatedHours: 22 },
  { id: 'p5-2', name: 'EMI (Electromagnetic Induction)', subject: Subject.PHYSICS, phase: 5, estimatedHours: 16 },
  { id: 'p5-3', name: 'Alternating Current (AC)', subject: Subject.PHYSICS, phase: 5, estimatedHours: 12 },
  { id: 'c5-1', name: 'Haloalkanes & Haloarenes', subject: Subject.CHEMISTRY, phase: 5, estimatedHours: 15 },
  { id: 'c5-2', name: 'Alcohols, Phenols & Ethers', subject: Subject.CHEMISTRY, phase: 5, estimatedHours: 16 },
  { id: 'c5-3', name: 'Aldehydes, Ketones & Carboxylic Acids', subject: Subject.CHEMISTRY, phase: 5, estimatedHours: 20 },
  { id: 'c5-4', name: 'Amines & Diazonium Salts', subject: Subject.CHEMISTRY, phase: 5, estimatedHours: 12 },
  { id: 'm5-1', name: 'Applications of Derivatives (AOD)', subject: Subject.MATHS, phase: 5, estimatedHours: 24 },
  { id: 'm5-2', name: 'Indefinite Integration', subject: Subject.MATHS, phase: 5, estimatedHours: 20 },
  { id: 'm5-3', name: 'Definite Integration', subject: Subject.MATHS, phase: 5, estimatedHours: 18 },
  { id: 'm5-4', name: 'Area Under Curve', subject: Subject.MATHS, phase: 5, estimatedHours: 10 },
  { id: 'm5-5', name: 'Differential Equations', subject: Subject.MATHS, phase: 5, estimatedHours: 14 },

  // --- PHASE 6: Optics, Modern Physics & Inorganic/Algebra (Class 12 end) ---
  { id: 'p6-1', name: 'Ray Optics & Optical Instruments', subject: Subject.PHYSICS, phase: 6, estimatedHours: 24 },
  { id: 'p6-2', name: 'Wave Optics', subject: Subject.PHYSICS, phase: 6, estimatedHours: 14 },
  { id: 'p6-3', name: 'Modern Physics (Dual Nature, Atoms, Nuclei)', subject: Subject.PHYSICS, phase: 6, estimatedHours: 22 },
  { id: 'p6-4', name: 'Semiconductors', subject: Subject.PHYSICS, phase: 6, estimatedHours: 10 },
  { id: 'c6-1', name: 'Solid State', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 12 },
  { id: 'c6-2', name: 'Solutions', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 12 },
  { id: 'c6-3', name: 'Electrochemistry', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 18 },
  { id: 'c6-4', name: 'Chemical Kinetics', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 14 },
  { id: 'c6-5', name: 'Surface Chemistry', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 8 },
  { id: 'c6-6', name: 'p-Block (Group 15-18)', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 16 },
  { id: 'c6-7', name: 'd & f-Block Elements', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 10 },
  { id: 'c6-8', name: 'Coordination Compounds', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 18 },
  { id: 'c6-9', name: 'Biomolecules & Polymers', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 10 },
  { id: 'c6-10', name: 'Chemistry in Everyday Life', subject: Subject.CHEMISTRY, phase: 6, estimatedHours: 6 },
  { id: 'm6-1', name: 'Vectors', subject: Subject.MATHS, phase: 6, estimatedHours: 14 },
  { id: 'm6-2', name: '3D Geometry', subject: Subject.MATHS, phase: 6, estimatedHours: 16 },
  { id: 'm6-3', name: 'Probability', subject: Subject.MATHS, phase: 6, estimatedHours: 18 },
  { id: 'm6-4', name: 'Matrices & Determinants', subject: Subject.MATHS, phase: 6, estimatedHours: 16 },
  { id: 'm6-5', name: 'Complex Numbers', subject: Subject.MATHS, phase: 6, estimatedHours: 18 },
];

export const INITIAL_PROGRESS: Record<string, TopicProgress> = {};
SYLLABUS_DATA.forEach(topic => {
  INITIAL_PROGRESS[topic.id] = {
    topicId: topic.id,
    status: Status.NOT_STARTED,
    // Initialize 4 exercises with default generic counts (user can edit)
    // Ex 1: Conceptual/Boards (60), Ex 2: Mains (50), Ex 3: Advanced/PYQ (40), Ex 4: Challenger (20)
    exercises: [
      { completed: 0, total: 60 }, 
      { completed: 0, total: 50 },
      { completed: 0, total: 40 },
      { completed: 0, total: 20 }
    ]
  };
});

// Offline Database for Questions
export const MOCK_QUESTION_DB: Partial<Record<Subject, Partial<Question>[]>> = {
  [Subject.PHYSICS]: [
    {
      questionText: "If the error in the measurement of the radius of a sphere is 2%, then the error in the determination of volume of the sphere will be:",
      options: ["4%", "8%", "2%", "6%"],
      correctAnswer: "6%",
      explanation: "Volume V = (4/3)πr³. The percentage error in V is 3 times the percentage error in r. 3 * 2% = 6%."
    },
    {
      questionText: "A projectile is fired at an angle of 45° with the horizontal. Elevation angle of the projectile at its highest point as seen from the point of projection, is:",
      options: ["60°", "tan⁻¹(1/2)", "tan⁻¹(√3/2)", "45°"],
      correctAnswer: "tan⁻¹(1/2)",
      explanation: "At maximum height, H = (u²sin²θ)/2g and Range R = (u²sin2θ)/g. For θ=45°, R = 4H. If α is the elevation angle, tan α = H/(R/2) = 2H/R. Substituting R=4H, tan α = 2H/4H = 1/2. So α = tan⁻¹(1/2)."
    },
    {
      questionText: "Two masses m and M are connected by a light string passing over a smooth pulley. When set free, m moves up and M moves down. The tension in the string is:",
      options: ["(M-m)g", "(M+m)g", "2mMg/(M+m)", "mMg/(M+m)"],
      correctAnswer: "2mMg/(M+m)",
      explanation: "Using standard Atwood machine formula: T = 2mMg / (M+m)."
    }
  ],
  [Subject.CHEMISTRY]: [
    {
      questionText: "Which of the following sets of quantum numbers is NOT possible?",
      options: ["n=3, l=2, m=0, s=+1/2", "n=2, l=2, m=1, s=-1/2", "n=4, l=0, m=0, s=-1/2", "n=3, l=2, m=-2, s=+1/2"],
      correctAnswer: "n=2, l=2, m=1, s=-1/2",
      explanation: "The angular momentum quantum number 'l' must be less than the principal quantum number 'n'. For n=2, possible values of l are 0 and 1. l cannot be 2."
    },
    {
      questionText: "Which species has a Trigonal Planar geometry?",
      options: ["NH3", "BF3", "PCl3", "IF3"],
      correctAnswer: "BF3",
      explanation: "Boron in BF3 is sp² hybridized with 0 lone pairs, leading to a trigonal planar geometry. NH3 is pyramidal, PCl3 is pyramidal, IF3 is T-shaped."
    },
    {
      questionText: "For a reaction A + B ⇌ C + D, if the concentration of A is doubled, the rate of reaction doubles. If concentration of B is doubled, the rate increases by a factor of 4. The order of reaction is:",
      options: ["2", "3", "1", "4"],
      correctAnswer: "3",
      explanation: "Rate ∝ [A]¹ and Rate ∝ [B]². Total Order = 1 + 2 = 3."
    }
  ],
  [Subject.MATHS]: [
    {
      questionText: "If the roots of the equation x² - bx + c = 0 be two consecutive integers, then b² - 4c equals:",
      options: ["-1", "0", "1", "2"],
      correctAnswer: "1",
      explanation: "Let roots be α and α+1. Sum = 2α+1 = b, Product = α(α+1) = c. Discriminant D = b² - 4c = (Roots diff)². (α+1 - α)² = 1² = 1."
    },
    {
      questionText: "The number of ways in which 5 boys and 5 girls can sit in a ring such that no two girls sit together is:",
      options: ["5! × 5!", "4! × 5!", "5! × 4!", "None of these"],
      correctAnswer: "4! × 5!",
      explanation: "First, arrange the 5 boys in a circle in (5-1)! = 4! ways. There are 5 gaps created between them. The 5 girls can be placed in these 5 gaps in 5! ways. Total ways = 4! × 5!."
    },
    {
      questionText: "The period of the function f(x) = sin⁴x + cos⁴x is:",
      options: ["π", "π/2", "2π", "π/4"],
      correctAnswer: "π/2",
      explanation: "f(x) = (sin²x + cos²x)² - 2sin²xcos²x = 1 - 0.5sin²(2x). sin²(2x) has period π/2. Thus f(x) has period π/2."
    }
  ]
}