
import React from 'react';
import { Atom, Sigma, Pi, Dna } from 'lucide-react';

interface LogoProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  
  // The graphic badge component (Circle + Arrow + Icons)
  const GraphicBadge = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const dims = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-32 h-32' : 'w-24 h-24';
    // CSS clip-path for an upward arrow shape
    const arrowClip = "polygon(50% 10%, 85% 40%, 70% 40%, 70% 90%, 30% 90%, 30% 40%, 15% 40%)";

    return (
      <div className={`relative ${dims} flex-shrink-0`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-900 bg-white shadow-sm"></div>
        
        {/* Inner Circle Background */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center border border-slate-700">
            
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 transform rotate-45 border border-white w-8 h-8 rounded"></div>
                <div className="absolute bottom-4 right-2 transform rotate-12 border-dashed border-white w-10 h-10 rounded-full"></div>
            </div>

            {/* The Upward Arrow Shape */}
            <div 
                className="absolute inset-0 bg-gradient-to-b from-blue-500 to-teal-600 z-10 shadow-inner"
                style={{ clipPath: arrowClip }}
            >
                {/* Icons Inside the Arrow (Masked by clip-path) */}
                <div className="relative w-full h-full opacity-90">
                    {/* Top Tip */}
                    <div className="absolute top-[15%] left-[42%] text-white/90 text-[10px] font-serif font-bold">
                        {'{+}'}
                    </div>
                    
                    {/* Center Alpha */}
                    <div className="absolute top-[35%] left-[35%] text-yellow-300 font-serif italic font-bold text-xl">
                        α
                    </div>

                    {/* Right Side Math */}
                    <div className="absolute top-[30%] right-[25%] text-white/80">
                        <Pi size={10} />
                    </div>

                    {/* Middle Sigma */}
                    <div className="absolute top-[50%] right-[30%] text-orange-300">
                        <Sigma size={14} />
                    </div>

                    {/* Left Atom */}
                    <div className="absolute top-[55%] left-[35%] text-blue-100">
                        <Atom size={14} />
                    </div>

                    {/* Bottom DNA */}
                    <div className="absolute bottom-[15%] left-[45%] text-teal-200">
                        <Dna size={12} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <GraphicBadge size="sm" />
        
        <div className="flex flex-col leading-none">
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-800 tracking-tighter">IIT</span>
                <span className="text-xl font-extrabold text-orange-600 tracking-tighter">JEE</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">Tracker</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      
      {/* Top Text */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-5xl font-extrabold text-slate-800 tracking-tight">IIT</span>
        <span className="text-5xl font-extrabold text-orange-600 tracking-tight">JEE</span>
      </div>

      {/* Main Graphic Badge */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
         <GraphicBadge size="lg" />
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-black text-blue-700 tracking-wide uppercase drop-shadow-sm">
            TRACKER
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-60">
            <div className="h-px w-8 bg-slate-400"></div>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                Your Journey. Your Data.
            </p>
            <div className="h-px w-8 bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
};
