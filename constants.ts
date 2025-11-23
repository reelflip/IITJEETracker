
import { Subject, Topic, TopicProgress, Status, Question } from './types';

// Comprehensive Syllabus Data simulating a 2-Year Coaching Structure (e.g., Bakliwal Tutorials)
export const SYLLABUS_DATA: Topic[] = [
  // --- PHASE 1: Foundation (Class 11 start) ---
  { 
    id: 'p1-1', 
    name: 'Units, Dimensions & Errors', 
    subject: Subject.PHYSICS, 
    phase: 1, 
    estimatedHours: 8,
    theorySummary: "**Dimensions**: Use [M L T] to check homogeneity. \n**Errors**: \n- Absolute Error: Δa = |a_mean - a_i|\n- Relative Error: Δa/a_mean\n- **Combination**: \n  - Z=A+B ⇒ ΔZ = ΔA + ΔB\n  - Z=A^n ⇒ ΔZ/Z = n(ΔA/A)\n**Vernier Calipers**: L.C. = 1 MSD - 1 VSD.\n**Screw Gauge**: L.C. = Pitch / No. of divisions."
  },
  { 
    id: 'p1-2', 
    name: 'Kinematics (1D, 2D, Relative)', 
    subject: Subject.PHYSICS, 
    phase: 1, 
    estimatedHours: 24,
    theorySummary: "**Eq of Motion**: v = u+at, s = ut+½at², v²=u²+2as (only for constant 'a').\n**Graphs**: Slope of x-t is v; Slope of v-t is a; Area of v-t is displacement.\n**Projectile**: \n- Time of Flight T = 2usinθ/g\n- Max H = u²sin²θ/2g\n- Range R = u²sin2θ/g\n**Relative**: v_AB = v_A - v_B. Apply separately in x and y."
  },
  { 
    id: 'p1-3', 
    name: 'Newton\'s Laws & Friction', 
    subject: Subject.PHYSICS, 
    phase: 1, 
    estimatedHours: 20,
    theorySummary: "**NLM**: F_net = ma. Draw FBD for every mass.\n**Equilibrium**: ΣF_x = 0, ΣF_y = 0.\n**Friction**: \n- Static f_s ≤ μ_s N (Self-adjusting)\n- Kinetic f_k = μ_k N (Constant direction opposite to relative slip)\n- Angle of Repose: tan θ = μ.\n**Pseudo Force**: -ma applied in non-inertial frame."
  },
  { 
    id: 'c1-1', 
    name: 'Mole Concept & Stoichiometry', 
    subject: Subject.CHEMISTRY, 
    phase: 1, 
    estimatedHours: 18,
    theorySummary: "**Mole**: n = W/M = N/N_A = V(STP)/22.4L.\n**Concentration**: \n- Molarity (M) = n_solute / V_sol (L)\n- Molality (m) = n_solute / W_solvent (kg)\n**Limiting Reagent**: Divide moles by coeff. Smallest is LR.\n**Equivalent Wt**: M/n-factor. Normality = M × n-factor."
  },
  { 
    id: 'c1-2', 
    name: 'Atomic Structure', 
    subject: Subject.CHEMISTRY, 
    phase: 1, 
    estimatedHours: 18,
    theorySummary: "**Bohr Model**: r_n ∝ n²/Z, E_n = -13.6 Z²/n² eV.\n**Spectrum**: 1/λ = R Z² (1/n1² - 1/n2²). Lyman (UV), Balmer (Visible).\n**Quantum Numbers**: n (shell), l (subshell, 0 to n-1), m (orbital, -l to +l), s (spin).\n**Configs**: Aufbau (energy order), Pauli (no 2 e- same QNs), Hund (max multiplicity)."
  },
  { 
    id: 'c1-3', 
    name: 'Periodic Properties', 
    subject: Subject.CHEMISTRY, 
    phase: 1, 
    estimatedHours: 12,
    theorySummary: "**Trends (L→R)**: Size↓, IE↑, EA↑, EN↑.\n**Trends (Top→Down)**: Size↑, IE↓, EA↓, EN↓.\n**Exceptions**: \n- IE: Be > B (full s), N > O (half p).\n- EA: Cl > F (repulsion in 2p), S > O.\n**Oxides**: Left basic, Right acidic, Al/Zn/Sn/Pb amphoteric."
  },
  { 
    id: 'm1-1', 
    name: 'Basic Maths & Logarithms', 
    subject: Subject.MATHS, 
    phase: 1, 
    estimatedHours: 12,
    theorySummary: "**Log Rules**: \n- log(ab) = log a + log b\n- log(a^n) = n log a\n- Base change: log_a b = log b / log a\n**Inequalities**: Wavy Curve Method. Watch for sign change when multiplying by negative.\n**Modulus**: |x| = x if x≥0, -x if x<0."
  },
  { 
    id: 'm1-2', 
    name: 'Quadratic Equations', 
    subject: Subject.MATHS, 
    phase: 1, 
    estimatedHours: 18,
    theorySummary: "**Roots**: α,β = [-b ± √D] / 2a.\n**Sum**: α+β = -b/a, **Prod**: αβ = c/a.\n**Nature**: D>0 real distinct, D=0 equal, D<0 imaginary.\n**Common Roots**: Make coeffs proportional (both common) or solve by cross-multiplication (one common).\n**Location of Roots**: Analyze graph w.r.t conditions on D, a*f(k), -b/2a."
  },
  { 
    id: 'm1-3', 
    name: 'Sequence & Series (AP/GP/HP)', 
    subject: Subject.MATHS, 
    phase: 1, 
    estimatedHours: 16,
    theorySummary: "**AP**: T_n = a+(n-1)d, S_n = n/2[2a+(n-1)d]. AM = (a+b)/2.\n**GP**: T_n = ar^(n-1), S_n = a(r^n - 1)/(r-1). S_inf = a/(1-r) (|r|<1). GM = √ab.\n**HP**: Reciprocals are in AP. HM = 2ab/(a+b).\n**Relation**: AM ≥ GM ≥ HM."
  },

  // --- PHASE 2: Mechanics Core & Bonding (Class 11 mid) ---
  { 
    id: 'p2-1', 
    name: 'Work, Power & Energy', 
    subject: Subject.PHYSICS, 
    phase: 2, 
    estimatedHours: 15,
    theorySummary: "**Work**: W = ∫F.ds = Fs cosθ.\n**W-E Theorem**: W_all = ΔK = Kf - Ki (Most useful).\n**Potential Energy**: ΔU = -W_conservative. \n- Gravitational: mgh\n- Spring: ½kx².\n**Power**: P = dW/dt = F.v."
  },
  { 
    id: 'p2-2', 
    name: 'Center of Mass & Collisions', 
    subject: Subject.PHYSICS, 
    phase: 2, 
    estimatedHours: 16,
    theorySummary: "**COM**: X_cm = (m1x1 + m2x2...)/M. Moves like a point mass under external force.\n**Collisions**: \n- Momentum Conserved always (if F_ext=0).\n- e = (v_sep)/(v_app).\n- Elastic (e=1): KE conserved.\n- Inelastic (0<e<1): KE loss.\n- Perfectly Inelastic (e=0): Stick together."
  },
  { 
    id: 'p2-3', 
    name: 'Rotational Mechanics', 
    subject: Subject.PHYSICS, 
    phase: 2, 
    estimatedHours: 30,
    theorySummary: "**Inertia (I)**: MR² (Ring), MR²/2 (Disc), 2/5 MR² (Solid Sphere).\n**Torque**: τ = r × F = Iα.\n**Angular Momentum**: L = Iω = r × p. Conserved if τ_ext = 0.\n**Rolling**: v = ωR (No slip). KE = ½mv² + ½Iω².\n**Toppling**: Check if torque of F > torque of mg about edge."
  },
  { 
    id: 'c2-1', 
    name: 'Chemical Bonding', 
    subject: Subject.CHEMISTRY, 
    phase: 2, 
    estimatedHours: 25,
    theorySummary: "**VSEPR**: lp-lp > lp-bp > bp-bp repulsion determines shape.\n- sp (linear), sp2 (trigonal), sp3 (tetrahedral), sp3d (TBP).\n**Hybridization**: σ + lp count.\n**MOT**: Bond Order = ½(Nb - Na). \n- O2 is paramagnetic (unpaired e- in π*).\n**Dipole**: Vector sum of bond moments. μ=0 ⇒ Non-polar."
  },
  { 
    id: 'c2-2', 
    name: 'Gaseous State', 
    subject: Subject.CHEMISTRY, 
    phase: 2, 
    estimatedHours: 14,
    theorySummary: "**Ideal Gas**: PV = nRT.\n**Dalton's Law**: P_total = Σp_i, p_i = x_i P_total.\n**Graham's Law**: Rate ∝ 1/√M.\n**Real Gas**: (P + an²/V²)(V - nb) = nRT.\n- 'a' measures attraction, 'b' measures volume.\n**Compressibility Z**: PV/nRT. Z=1 ideal, Z<1 attraction dominates."
  },
  { 
    id: 'c2-3', 
    name: 'Chemical Equilibrium', 
    subject: Subject.CHEMISTRY, 
    phase: 2, 
    estimatedHours: 16,
    theorySummary: "**Law of Mass Action**: K_c = [Prod]^coeff / [React]^coeff.\n**Kp**: K_c(RT)^Δng.\n**Le Chatelier**: System opposes change.\n- Add Reactant ⇒ Forward.\n- Increase P ⇒ Towards less moles.\n- Exo (ΔH<0) + Heat ⇒ Backward."
  },
  { 
    id: 'm2-1', 
    name: 'Trigonometric Ratios & Identities', 
    subject: Subject.MATHS, 
    phase: 2, 
    estimatedHours: 20,
    theorySummary: "**Formulas**: \n- sin²θ + cos²θ = 1\n- sin(A+B) = sinAcosB + cosAsinB\n- cos(2A) = cos²A - sin²A = 2cos²A-1\n- sin(2A) = 2sinAcosA\n**Sum to Product**: sinC + sinD = 2sin((C+D)/2)cos((C-D)/2).\n**Range**: a sinx + b cosx ∈ [-√(a²+b²), +√(a²+b²)]."
  },
  { 
    id: 'm2-2', 
    name: 'Trigonometric Equations', 
    subject: Subject.MATHS, 
    phase: 2, 
    estimatedHours: 10,
    theorySummary: "**General Solutions**:\n- sin θ = sin α ⇒ θ = nπ + (-1)ⁿα\n- cos θ = cos α ⇒ θ = 2nπ ± α\n- tan θ = tan α ⇒ θ = nπ + α\n**Strategy**: Convert to single ratio, check domain validity."
  },
  { 
    id: 'm2-3', 
    name: 'Solution of Triangles', 
    subject: Subject.MATHS, 
    phase: 2, 
    estimatedHours: 12,
    theorySummary: "**Sine Rule**: a/sinA = b/sinB = c/sinC = 2R.\n**Cosine Rule**: cosA = (b²+c²-a²)/2bc.\n**Projection**: a = b cosC + c cosB.\n**Area**: ½ab sinC = √[s(s-a)(s-b)(s-c)].\n**Radii**: r = Δ/s (Inradius), R = abc/4Δ (Circumradius)."
  },

  // --- PHASE 3: Matter, Thermo & Coordinate Geometry (Class 11 end) ---
  { 
    id: 'p3-1', 
    name: 'Gravitation', 
    subject: Subject.PHYSICS, 
    phase: 3, 
    estimatedHours: 12,
    theorySummary: "**Force**: F = Gm1m2/r². **Field (g)**: GM/r².\n**Potential (V)**: -GM/r.\n**Kepler's Laws**: \n1. Elliptical Orbits.\n2. dA/dt = L/2m = constant.\n3. T² ∝ R³.\n**Satellite**: v_orb = √(GM/r), v_esc = √(2GM/R)."
  },
  { 
    id: 'p3-2', 
    name: 'Properties of Solids & Fluids', 
    subject: Subject.PHYSICS, 
    phase: 3, 
    estimatedHours: 20,
    theorySummary: "**Solids**: Stress = Y × Strain. Y = FL/AΔL.\n**Fluids Pressure**: P = P_0 + hρg.\n**Archimedes**: Buoyant Force = Weight of displaced fluid.\n**Continuity**: A1v1 = A2v2.\n**Bernoulli**: P + ρgh + ½ρv² = constant.\n**Viscosity**: F = 6πηrv (Stokes)."
  },
  { 
    id: 'p3-3', 
    name: 'Thermal Properties of Matter', 
    subject: Subject.PHYSICS, 
    phase: 3, 
    estimatedHours: 10,
    theorySummary: "**Expansion**: ΔL = LαΔT. β=2α, γ=3α.\n**Calorimetry**: Heat Lost = Heat Gained. Q=mcΔT or Q=mL.\n**Heat Transfer**: \n- Conduction: dQ/dt = KA(T1-T2)/L\n- Radiation: E = σAT⁴ (Stefan's Law)\n- Newton's Cooling: Rate ∝ (T_body - T_surr)."
  },
  { 
    id: 'p3-4', 
    name: 'Thermodynamics (Physics)', 
    subject: Subject.PHYSICS, 
    phase: 3, 
    estimatedHours: 14,
    theorySummary: "**1st Law**: ΔQ = ΔU + ΔW.\n**Processes**: \n- Isothermal (T const): ΔU=0, W = nRT ln(V2/V1).\n- Adiabatic (Q=0): PV^γ = const, W = (P1V1-P2V2)/(γ-1).\n- Isochoric (V const): W=0.\n**Efficiency**: η = 1 - T_sink/T_source (Carnot)."
  },
  { 
    id: 'p3-5', 
    name: 'SHM (Simple Harmonic Motion)', 
    subject: Subject.PHYSICS, 
    phase: 3, 
    estimatedHours: 16,
    theorySummary: "**Eq**: F = -kx, a = -ω²x.\n**Displacement**: x = A sin(ωt + φ).\n**Velocity**: v = ω√(A²-x²).\n**Energy**: E = ½kA² (constant).\n**Time Period**: \n- Spring: 2π√(m/k)\n- Pendulum: 2π√(L/g)."
  },
  { 
    id: 'p3-6', 
    name: 'Waves & Sound', 
    subject: Subject.PHYSICS, 
    phase: 3, 
    estimatedHours: 18,
    theorySummary: "**Equation**: y = A sin(ωt ± kx).\n**Velocity**: v = ω/k. String v = √(T/μ).\n**Standing Waves**: Nodes (zero amp), Antinodes (max amp).\n**Organ Pipes**: Open (all harmonics), Closed (odd harmonics).\n**Beats**: f_beat = |f1 - f2|.\n**Doppler**: f_app = f_src [(v±v_obs)/(v∓v_src)]."
  },
  { 
    id: 'c3-1', 
    name: 'Ionic Equilibrium', 
    subject: Subject.CHEMISTRY, 
    phase: 3, 
    estimatedHours: 20,
    theorySummary: "**pH**: -log[H+]. Kw = [H+][OH-] = 10^-14.\n**Buffers**: pH = pKa + log([Salt]/[Acid]) (Henderson Eq).\n**Solubility Product (Ksp)**: For AxBy ⇌ xA + yB, Ksp = [A]^x [B]^y.\n- Precipitates if Q > Ksp.\n**Hydrolysis**: Strong Acid + Weak Base ⇒ Acidic."
  },
  { 
    id: 'c3-2', 
    name: 'Thermodynamics & Thermochemistry', 
    subject: Subject.CHEMISTRY, 
    phase: 3, 
    estimatedHours: 20,
    theorySummary: "**1st Law**: ΔU = q + w (Sign convention: w on system +).\n**Enthalpy**: ΔH = ΔU + ΔngRT.\n**Entropy (S)**: Measure of disorder. ΔG = ΔH - TΔS.\n**Spontaneity**: ΔG < 0.\n**Hess Law**: Enthalpy change is path independent."
  },
  { 
    id: 'c3-3', 
    name: 'Redox Reactions', 
    subject: Subject.CHEMISTRY, 
    phase: 3, 
    estimatedHours: 10,
    theorySummary: "**Oxidation**: Loss of e- (Increase ON).\n**Reduction**: Gain of e- (Decrease ON).\n**Balancing**: Ion-electron method (Split into half reactions).\n**n-factor**: Total e- change per mole.\n**Disproportionation**: Same element oxidizes & reduces."
  },
  { 
    id: 'c3-4', 
    name: 'Hydrogen & s-Block Elements', 
    subject: Subject.CHEMISTRY, 
    phase: 3, 
    estimatedHours: 15,
    theorySummary: "**Hydrogen**: H2 prep (Zn+acid), Hydrides (Ionic/Covalent).\n**s-Block (Grp 1/2)**: \n- Flame colors (Li-Red, Na-Yellow).\n- Solubility: Carbonates decreases down group (Grp 2), Sulfates decreases down group.\n- Stability: Carbonates increases down group."
  },
  { 
    id: 'c3-5', 
    name: 'p-Block (Group 13-14)', 
    subject: Subject.CHEMISTRY, 
    phase: 3, 
    estimatedHours: 12,
    theorySummary: "**Grp 13 (Boron)**: Inert pair effect (Tl+1 stable). B2H6 (Banana bond, 3c-2e).\n**Grp 14 (Carbon)**: Catenation property. Allotropes (Diamond, Graphite, Fullerenes).\n**Silicates**: SiO4 units. Zeolites (Shape selective catalysis)."
  },
  { 
    id: 'm3-1', 
    name: 'Straight Lines & Pair of Lines', 
    subject: Subject.MATHS, 
    phase: 3, 
    estimatedHours: 20,
    theorySummary: "**Slope**: m = tan θ = (y2-y1)/(x2-x1).\n**Forms**: y=mx+c, y-y1=m(x-x1), x/a + y/b = 1.\n**Distance**: Point to line d = |ax1+by1+c|/√(a²+b²).\n**Pair of Lines**: ax² + 2hxy + by² = 0 represents two lines through origin. tan θ = |2√(h²-ab)/(a+b)|."
  },
  { 
    id: 'm3-2', 
    name: 'Circles', 
    subject: Subject.MATHS, 
    phase: 3, 
    estimatedHours: 18,
    theorySummary: "**Eq**: (x-h)² + (y-k)² = r². General: x²+y²+2gx+2fy+c=0 (Center -g,-f).\n**Tangent**: T=0 (at point), y=mx ± r√(1+m²) (slope form).\n**Family**: S + λL = 0 (Intersection of circle and line).\n**Radical Axis**: S1 - S2 = 0."
  },
  { 
    id: 'm3-3', 
    name: 'Parabola', 
    subject: Subject.MATHS, 
    phase: 3, 
    estimatedHours: 12,
    theorySummary: "**Std Eq**: y² = 4ax. Focus (a,0), Directrix x = -a.\n**Parametric**: (at², 2at).\n**Tangent**: y = mx + a/m (slope form), ty = x + at² (parametric).\n**Normal**: y = -tx + 2at + at³."
  },
  { 
    id: 'm3-4', 
    name: 'Ellipse & Hyperbola', 
    subject: Subject.MATHS, 
    phase: 3, 
    estimatedHours: 16,
    theorySummary: "**Ellipse**: x²/a² + y²/b² = 1. e = √(1 - b²/a²). Foci (±ae, 0).\n**Hyperbola**: x²/a² - y²/b² = 1. e = √(1 + b²/a²).\n**Tangents**: y = mx ± √(a²m² + b²) (Ellipse), y = mx ± √(a²m² - b²) (Hyperbola).\n**Asymptotes**: y = ±(b/a)x for Hyperbola."
  },
  { 
    id: 'm3-5', 
    name: 'Binomial Theorem', 
    subject: Subject.MATHS, 
    phase: 3, 
    estimatedHours: 14,
    theorySummary: "**Expansion**: (x+y)ⁿ = Σ nCr x^(n-r) y^r.\n**General Term**: T_{r+1} = nCr x^(n-r) y^r.\n**Coeffs**: Sum = 2ⁿ. Sum of odd = Sum of even = 2ⁿ⁻¹.\n**Middle Term**: n/2 + 1 (n even), (n+1)/2 & (n+3)/2 (n odd)."
  },
  { 
    id: 'm3-6', 
    name: 'Permutation & Combination', 
    subject: Subject.MATHS, 
    phase: 3, 
    estimatedHours: 18,
    theorySummary: "**nPr**: n!/(n-r)! (Arrangement).\n**nCr**: n!/[r!(n-r)!] (Selection). nCr = nC(n-r).\n**Circular**: (n-1)!. With identical items: n! / (p! q! ...).\n**Gap Method**: Keep gaps between items to separate them.\n**Beggar Method**: x1+...xr = n (non-neg integral solutions) = (n+r-1)C(r-1)."
  },

  // --- PHASE 4: Electrodynamics & Organic Start (Class 12 start) ---
  { 
    id: 'p4-1', 
    name: 'Electrostatics', 
    subject: Subject.PHYSICS, 
    phase: 4, 
    estimatedHours: 26,
    theorySummary: "**Coulomb**: F = kq1q2/r². **Field**: E = F/q.\n**Gauss Law**: φ = ∮E.dA = q_in / ε₀.\n**Potential**: V = kq/r. E = -dV/dr.\n**Dipole**: p=q(2a). E_axial = 2kp/r³, E_eq = -kp/r³. Torque τ = p × E.\n**Conductors**: E_inside = 0, Potential constant."
  },
  { 
    id: 'p4-2', 
    name: 'Capacitors', 
    subject: Subject.PHYSICS, 
    phase: 4, 
    estimatedHours: 12,
    theorySummary: "**C = Q/V**. Parallel Plate: C = ε₀A/d.\n**Energy**: U = ½CV² = Q²/2C.\n**Dielectric**: C' = KC.\n**Series**: 1/C_eq = 1/C1 + 1/C2.\n**Parallel**: C_eq = C1 + C2.\n**RC Circuit**: q = Q(1 - e^{-t/RC}) charging."
  },
  { 
    id: 'p4-3', 
    name: 'Current Electricity', 
    subject: Subject.PHYSICS, 
    phase: 4, 
    estimatedHours: 20,
    theorySummary: "**Ohm's Law**: V=IR. R = ρL/A.\n**Drift Velocity**: v_d = I/neA.\n**Kirchhoff**: KCL (ΣI=0), KVL (ΣV=0).\n**Power**: I²R.\n**Instruments**: \n- Meter Bridge (Wheatstone).\n- Potentiometer (Null point method, compares EMF)."
  },
  { 
    id: 'c4-1', 
    name: 'GOC (General Organic Chemistry)', 
    subject: Subject.CHEMISTRY, 
    phase: 4, 
    estimatedHours: 28,
    theorySummary: "**Effects**: \n- Inductive (I): Distance dependent (σ bonds).\n- Resonance (R/M): Delocalization (π bonds). Stronger than I.\n- Hyperconjugation (H): σ-p overlap (stability of carbocations/alkenes).\n**Acidity**: Stable conjugate base anion (-M, -I helps).\n**Basicity**: Available LP (+I, +M helps)."
  },
  { 
    id: 'c4-2', 
    name: 'Isomerism', 
    subject: Subject.CHEMISTRY, 
    phase: 4, 
    estimatedHours: 14,
    theorySummary: "**Structural**: Chain, Positional, Functional, Metamerism.\n**Stereo**: \n- Geometrical: Cis/Trans, E/Z (Restricted rotation).\n- Optical: Chiral center, Enantiomers (Non-superimposable mirror), Diastereomers.\n- Meso: Chiral centers but plane of symmetry (optically inactive)."
  },
  { 
    id: 'c4-3', 
    name: 'Hydrocarbons', 
    subject: Subject.CHEMISTRY, 
    phase: 4, 
    estimatedHours: 18,
    theorySummary: "**Alkanes**: Radical halogenation (Selectivity 3°>2°>1°).\n**Alkenes**: Electrophilic Addition (Markovnikov). Ozonolysis (C=C cleavage).\n**Alkynes**: Acidic H with NaNH2.\n**Benzene**: EAS (Nitration, Friedel Crafts). Ortho/Para directors (-OH, -R), Meta directors (-NO2)."
  },
  { 
    id: 'c4-4', 
    name: 'Environmental Chemistry', 
    subject: Subject.CHEMISTRY, 
    phase: 4, 
    estimatedHours: 6,
    theorySummary: "**Smog**: Classical (London/Reducing), Photochemical (LA/Oxidizing - PAN, Ozone).\n**Greenhouse Gases**: CO2, CH4, O3, CFCs.\n**Ozone Depletion**: CFCs release Cl radicals.\n**Water**: BOD (Biochemical Oxygen Demand), COD. Eutrophication."
  },
  { 
    id: 'm4-1', 
    name: 'Set, Relations & Functions', 
    subject: Subject.MATHS, 
    phase: 4, 
    estimatedHours: 20,
    theorySummary: "**Relations**: Reflexive, Symmetric, Transitive (Equivalence).\n**Functions**: \n- One-one (Injective): Horizontal Line Test.\n- Onto (Surjective): Range = Codomain.\n- Even/Odd: f(-x) = f(x) / -f(x).\n- Periodic: f(x+T) = f(x).\n- Composite: fog(x) = f(g(x))."
  },
  { 
    id: 'm4-2', 
    name: 'Inverse Trigonometric Functions', 
    subject: Subject.MATHS, 
    phase: 4, 
    estimatedHours: 12,
    theorySummary: "**Domains/Ranges**: \n- sin⁻¹x: [-1,1] → [-π/2, π/2]\n- cos⁻¹x: [-1,1] → [0, π]\n- tan⁻¹x: R → (-π/2, π/2)\n**Properties**: \n- sin⁻¹x + cos⁻¹x = π/2.\n- tan⁻¹x + tan⁻¹y = tan⁻¹((x+y)/(1-xy)) (Check xy<1)."
  },
  { 
    id: 'm4-3', 
    name: 'Limits, Continuity & Differentiability', 
    subject: Subject.MATHS, 
    phase: 4, 
    estimatedHours: 22,
    theorySummary: "**Limits**: L'Hopital Rule (0/0 or ∞/∞). Standard limits (sin x/x → 1).\n**Continuity**: LHL = RHL = f(a).\n**Differentiability**: LHD = RHD. Implies continuity (Continuity doesn't imply Diff).\n- Sharp corners = Non-differentiable."
  },
  { 
    id: 'm4-4', 
    name: 'Differentiation (Methods)', 
    subject: Subject.MATHS, 
    phase: 4, 
    estimatedHours: 15,
    theorySummary: "**Chain Rule**: d/dx f(g(x)) = f'(g(x)) g'(x).\n**Implicit**: Differentiate both sides.\n**Parametric**: dy/dx = (dy/dt) / (dx/dt).\n**Logarithmic**: For y = f(x)^g(x), take log.\n**Higher Order**: d²y/dx²."
  },

  // --- PHASE 5: Electromagnetism & Calculus (Class 12 mid) ---
  { 
    id: 'p5-1', 
    name: 'Moving Charges & Magnetism', 
    subject: Subject.PHYSICS, 
    phase: 5, 
    estimatedHours: 22,
    theorySummary: "**Biot-Savart**: dB = (μ₀/4π) Idl×r / r³.\n**Ampere Law**: ∮B.dl = μ₀I_in.\n**Force**: F = q(v×B) + qE (Lorentz). F = IL×B (Wire).\n**Motion**: Circle (v⊥B, r=mv/qB), Helix (Angle θ).\n**Solenoid**: B = μ₀ni."
  },
  { 
    id: 'p5-2', 
    name: 'EMI (Electromagnetic Induction)', 
    subject: Subject.PHYSICS, 
    phase: 5, 
    estimatedHours: 16,
    theorySummary: "**Flux**: φ = B.A.\n**Faraday Law**: ε = -dφ/dt.\n**Lenz Law**: Induced current opposes cause.\n**Motional EMF**: ε = Bvl.\n**Self Inductance**: φ = LI, ε = -L dI/dt. Energy = ½LI².\n**Mutual Inductance**: φ2 = M I1."
  },
  { 
    id: 'p5-3', 
    name: 'Alternating Current (AC)', 
    subject: Subject.PHYSICS, 
    phase: 5, 
    estimatedHours: 12,
    theorySummary: "**RMS**: I_rms = I_0/√2.\n**Reactance**: X_L = ωL, X_C = 1/ωC.\n**Impedance**: Z = √(R² + (X_L-X_C)²).\n**Resonance**: X_L = X_C ⇒ ω = 1/√(LC). Current max.\n**Power**: P = V_rms I_rms cosφ. Power Factor cosφ = R/Z."
  },
  { 
    id: 'c5-1', 
    name: 'Haloalkanes & Haloarenes', 
    subject: Subject.CHEMISTRY, 
    phase: 5, 
    estimatedHours: 15,
    theorySummary: "**SN1**: 2 steps, Carbocation interm, Racemization, 3°>2°>1°.\n**SN2**: 1 step, Transition state, Inversion (Walden), 1°>2°>3°.\n**E1/E2**: Elimination to form alkene (Zaitsev rule - highly sub stable).\n**Grignard**: RMgX + H+ ⇒ RH."
  },
  { 
    id: 'c5-2', 
    name: 'Alcohols, Phenols & Ethers', 
    subject: Subject.CHEMISTRY, 
    phase: 5, 
    estimatedHours: 16,
    theorySummary: "**Alcohols**: Lucas Test (Turbidity: 3°-fast, 1°-slow). Oxidize to Ald/Ketone/Acid.\n**Phenols**: Acidic (Reimer Tiemann ⇒ Salicylaldehyde, Kolbe ⇒ Salicylic Acid).\n**Ethers**: Williamson Synthesis (RONa + RX).\n**Cleavage**: With HI, I goes to smaller alkyl (SN2) or stable cation site (SN1)."
  },
  { 
    id: 'c5-3', 
    name: 'Aldehydes, Ketones & Carboxylic Acids', 
    subject: Subject.CHEMISTRY, 
    phase: 5, 
    estimatedHours: 20,
    theorySummary: "**Reactions**: Nucleophilic Addition.\n- Aldol: α-H required, dil NaOH.\n- Cannizzaro: No α-H, conc NaOH.\n- Clemmensen (Zn-Hg/HCl) / Wolff Kishner: Reduction to alkane.\n- Tollen's/Fehling's: Test for Aldehydes.\n**Acids**: HVZ reaction (α-halogenation). Decarboxylation (Soda lime)."
  },
  { 
    id: 'c5-4', 
    name: 'Amines & Diazonium Salts', 
    subject: Subject.CHEMISTRY, 
    phase: 5, 
    estimatedHours: 12,
    theorySummary: "**Basicity**: 2° > 1° > 3° (in aq due to hydration/steric).\n**Tests**: Carbylamine (1° amine ⇒ foul smell), Hinsberg (Separation).\n**Diazonium**: Sandmeyer (CuX), Gatterman. Coupling reactions (Azo dyes)."
  },
  { 
    id: 'm5-1', 
    name: 'Applications of Derivatives (AOD)', 
    subject: Subject.MATHS, 
    phase: 5, 
    estimatedHours: 24,
    theorySummary: "**Tangent/Normal**: Slope dy/dx.\n**Monotonicity**: f'(x) > 0 (Inc), f'(x) < 0 (Dec).\n**Maxima/Minima**: f'(x)=0. Check signs of f'(x) around point or f''(x).\n**Rate Measure**: dy/dt.\n**Mean Value Theorems**: Rolle's, LMVT."
  },
  { 
    id: 'm5-2', 
    name: 'Indefinite Integration', 
    subject: Subject.MATHS, 
    phase: 5, 
    estimatedHours: 20,
    theorySummary: "**Methods**: Substitution, By Parts (ILATE), Partial Fractions.\n**Standard Forms**: \n- ∫dx/√(a²-x²) = sin⁻¹(x/a)\n- ∫e^x (f(x)+f'(x)) dx = e^x f(x).\n- ∫sec x = ln|sec x + tan x|."
  },
  { 
    id: 'm5-3', 
    name: 'Definite Integration', 
    subject: Subject.MATHS, 
    phase: 5, 
    estimatedHours: 18,
    theorySummary: "**Properties**:\n- ∫_a^b f(x) = ∫_a^b f(a+b-x) (King's Prop).\n- ∫_-a^a f(x): 0 if odd, 2∫_0^a if even.\n**Leibniz Rule**: Differentiation under integral sign.\n**Estimation**: Sum of limits using inequalities."
  },
  { 
    id: 'm5-4', 
    name: 'Area Under Curve', 
    subject: Subject.MATHS, 
    phase: 5, 
    estimatedHours: 10,
    theorySummary: "**Formula**: Area = ∫_a^b |y| dx or ∫_c^d |x| dy.\n**Between curves**: ∫ [f(x) - g(x)] dx.\n- Draw rough sketch first.\n- Find intersection points as limits."
  },
  { 
    id: 'm5-5', 
    name: 'Differential Equations', 
    subject: Subject.MATHS, 
    phase: 5, 
    estimatedHours: 14,
    theorySummary: "**Variable Separable**: f(x)dx = g(y)dy.\n**Homogeneous**: y=vx. dy/dx = v + x dv/dx.\n**Linear (LDE)**: dy/dx + Py = Q. IF = e^∫Pdx. Sol: y(IF) = ∫Q(IF)dx.\n**Order/Degree**: Highest derivative power."
  },

  // --- PHASE 6: Optics, Modern Physics & Inorganic/Algebra (Class 12 end) ---
  { 
    id: 'p6-1', 
    name: 'Ray Optics & Optical Instruments', 
    subject: Subject.PHYSICS, 
    phase: 6, 
    estimatedHours: 24,
    theorySummary: "**Reflection**: ∠i=∠r. Mirror Formula: 1/v + 1/u = 1/f.\n**Snell's Law**: μ1 sin i = μ2 sin r.\n**Lens Maker**: 1/f = (μ-1)(1/R1 - 1/R2).\n**TIR**: i > critical angle (sin C = 1/μ).\n**Prism**: δ = i + e - A. δ_min at i=e.\n**Instruments**: Telescope (fo/fe), Microscope."
  },
  { 
    id: 'p6-2', 
    name: 'Wave Optics', 
    subject: Subject.PHYSICS, 
    phase: 6, 
    estimatedHours: 14,
    theorySummary: "**YDSE**: Fringe width β = λD/d. Maxima path diff nλ.\n**Diffraction**: Central max width 2λD/a. Minima at a sinθ = nλ.\n**Polarization**: Malus Law I = I₀ cos²θ. Brewster's Angle tan i_p = μ."
  },
  { 
    id: 'p6-3', 
    name: 'Modern Physics (Dual Nature, Atoms, Nuclei)', 
    subject: Subject.PHYSICS, 
    phase: 6, 
    estimatedHours: 22,
    theorySummary: "**Photoelectric**: KE_max = hν - φ (Einstein).\n**De Broglie**: λ = h/p = h/√2mK.\n**Atoms**: E_n = -13.6/n² eV. Transition ΔE = hν.\n**Nuclei**: R = R₀ A^⅓. Binding Energy Δmc². Radioactivity: N = N₀ e^{-λt}. Half life 0.693/λ."
  },
  { 
    id: 'p6-4', 
    name: 'Semiconductors', 
    subject: Subject.PHYSICS, 
    phase: 6, 
    estimatedHours: 10,
    theorySummary: "**P-N Junction**: Forward bias (conducting), Reverse (blocking).\n**Rectifier**: Converts AC to DC.\n**Transistor**: Emitter (heavily doped), Base (thin), Collector (large). I_E = I_B + I_C.\n**Logic Gates**: AND, OR, NOT, NAND, NOR (Truth tables)."
  },
  { 
    id: 'c6-1', 
    name: 'Solid State', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 12,
    theorySummary: "**Unit Cells**: SC (Z=1), BCC (Z=2), FCC (Z=4).\n**Packing Eff**: FCC (74%) > BCC (68%) > SC (52%).\n**Density**: d = ZM / a³N_A.\n**Defects**: Schottky (Vacancy, density↓), Frenkel (Dislocation, density same)."
  },
  { 
    id: 'c6-2', 
    name: 'Solutions', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 12,
    theorySummary: "**Raoult's Law**: P = x_A P_A⁰ + x_B P_B⁰.\n**Colligative Props**: Depends on no. of particles (i).\n- RLVP: ΔP/P⁰ = x_solute\n- ΔTb = i Kb m\n- ΔTf = i Kf m\n- π = i CRT (Osmotic).\n**Van't Hoff i**: 1+(n-1)α for dissociation."
  },
  { 
    id: 'c6-3', 
    name: 'Electrochemistry', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 18,
    theorySummary: "**Nernst Eq**: E = E⁰ - (0.059/n) log Q.\n**Conductance**: Λ_m = κ × 1000/M. Kohlrausch Law (Infinite dilution).\n**Faraday's Laws**: w = ZIt. w1/E1 = w2/E2.\n**Batteries**: Lead storage (Rechargeable), Fuel cells."
  },
  { 
    id: 'c6-4', 
    name: 'Chemical Kinetics', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 14,
    theorySummary: "**Rate Law**: Rate = k[A]^x[B]^y.\n**Order**: 0 (Rate=k, t½ ∝ a), 1 (Rate=kA, t½ const), 2.\n**Integrated**: k = (2.303/t) log(A0/At) for 1st order.\n**Arrhenius**: k = A e^{-Ea/RT}. log k vs 1/T slope = -Ea/2.303R."
  },
  { 
    id: 'c6-5', 
    name: 'Surface Chemistry', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 8,
    theorySummary: "**Adsorption**: Physisorption (Weak van der Waals, Multi layer), Chemisorption (Strong bond, Mono layer).\n**Isotherms**: Freundlich x/m = k P^(1/n).\n**Colloids**: Tyndall effect, Brownian motion. Coagulation (Hardy Schulze rule: High charge ion better)."
  },
  { 
    id: 'c6-6', 
    name: 'p-Block (Group 15-18)', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 16,
    theorySummary: "**Grp 15**: N2 (inert triple bond). P4 (White - reactive, Red). NH3 (Haber).\n**Grp 16**: O2, O3. H2SO4 (Contact process).\n**Grp 17**: Halogens. High EA. Interhalogens (XX').\n**Grp 18**: Xe compounds (XeF2 linear, XeF4 square planar)."
  },
  { 
    id: 'c6-7', 
    name: 'd & f-Block Elements', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 10,
    theorySummary: "**Transition**: Variable OS, Colored ions (d-d transition), Catalysts.\n**KMnO4/K2Cr2O7**: Strong oxidizers. Cr2O7 (Orange) ⇌ CrO4 (Yellow) pH dependent.\n**Lanthanoids**: Contraction (Size decreases steadily), Shielding of 4f is poor."
  },
  { 
    id: 'c6-8', 
    name: 'Coordination Compounds', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 18,
    theorySummary: "**IUPAC**: Naming ligands.\n**VBT**: Hybridization (sp3/dsp2/d2sp3). Inner vs Outer orbital.\n**CFT**: Splitting of d-orbitals. Δo > P (Pairing, Low spin), Δo < P (High spin).\n**Isomerism**: Linkage, Ionization, Geometrical (Ma2b2), Optical."
  },
  { 
    id: 'c6-9', 
    name: 'Biomolecules & Polymers', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 10,
    theorySummary: "**Carbs**: Glucose (Aldohexose), Fructose. Glycosidic linkage.\n**Proteins**: Amino acids (Zwitter ion). Peptide bond. Primary/Sec/Tert struct.\n**Polymers**: Addition (Polythene) vs Condensation (Nylon 6,6, Polyester).\n**Rubber**: Natural (cis-polyisoprene). Vulcanization (Sulfur)."
  },
  { 
    id: 'c6-10', 
    name: 'Chemistry in Everyday Life', 
    subject: Subject.CHEMISTRY, 
    phase: 6, 
    estimatedHours: 6,
    theorySummary: "**Drugs**: Analgesics (Pain), Antipyretics (Fever), Antibiotics, Antiseptics.\n**Soaps**: Na/K salts of fatty acids. Saponification.\n**Detergents**: Anionic (Labs), Cationic (Hair conditioner), Non-ionic.\n**Food**: Preservatives, Artificial Sweeteners."
  },
  { 
    id: 'm6-1', 
    name: 'Vectors', 
    subject: Subject.MATHS, 
    phase: 6, 
    estimatedHours: 14,
    theorySummary: "**Dot Product**: a.b = |a||b|cosθ. (Proj of a on b).\n**Cross Product**: a×b = |a||b|sinθ n^. Area of triangle/parallelogram.\n**Triple Prod**: \n- Scalar [a b c] = a.(b×c) (Volume of parallelopiped).\n- Vector a×(b×c) = (a.c)b - (a.b)c."
  },
  { 
    id: 'm6-2', 
    name: '3D Geometry', 
    subject: Subject.MATHS, 
    phase: 6, 
    estimatedHours: 16,
    theorySummary: "**Lines**: (x-x1)/a = (y-y1)/b = (z-z1)/c.\n**Planes**: ax+by+cz+d=0. Normal vector (a,b,c).\n**Shortest Dist**: Skew lines. d = |(a2-a1).(b1×b2)| / |b1×b2|.\n**Angle**: cosθ = n1.n2 / |n1||n2|."
  },
  { 
    id: 'm6-3', 
    name: 'Probability', 
    subject: Subject.MATHS, 
    phase: 6, 
    estimatedHours: 18,
    theorySummary: "**Conditional**: P(A|B) = P(A∩B)/P(B).\n**Independent**: P(A∩B) = P(A)P(B).\n**Bayes Theorem**: P(Ei|A) = P(A|Ei)P(Ei) / Σ P(A|Ej)P(Ej) (Reverse Probability).\n**Bernoulli**: P(X=r) = nCr p^r q^(n-r)."
  },
  { 
    id: 'm6-4', 
    name: 'Matrices & Determinants', 
    subject: Subject.MATHS, 
    phase: 6, 
    estimatedHours: 16,
    theorySummary: "**Determinant**: |AB| = |A||B|. Properties (Row/Col ops).\n**Inverse**: A⁻¹ = adj(A)/|A|. AA⁻¹ = I.\n**System of Eq**: AX=B. Unique sol if |A|≠0. Infinite/No sol if |A|=0 (Check adjA.B).\n**Cayley Hamilton**: Matrix satisfies its characteristic eq."
  },
  { 
    id: 'm6-5', 
    name: 'Complex Numbers', 
    subject: Subject.MATHS, 
    phase: 6, 
    estimatedHours: 18,
    theorySummary: "**Forms**: z = x+iy = r(cosθ + i sinθ) = re^{iθ}.\n**Modulus**: |z| = √(x²+y²). **Arg**: θ.\n**Cube roots of unity**: 1, ω, ω². 1+ω+ω²=0, ω³=1.\n**Rotation**: z2 = z1 e^{iα}.\n**Geometry**: |z-z1| + |z-z2| = 2a (Ellipse)."
  },
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