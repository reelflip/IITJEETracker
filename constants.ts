
import { Subject, Topic, TopicProgress, Status } from './types';

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
