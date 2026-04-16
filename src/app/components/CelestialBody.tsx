import { motion } from "motion/react";

type CelestialBodyType = "moon" | "planet" | "orb" | "comet";

interface CelestialBodyProps {
  type: CelestialBodyType;
  variant: string;
  size?: number;
  progress?: number; // 0-100, for charging animation
  locked?: boolean;
  hasRing?: boolean;
  color?: string; // Optional custom color passed from server/client lists
}

const variantColors: Record<string, { base: string; glow: string; ring?: string }> = {
  // Comets
  "ice-comet": { base: "#E0F2FE", glow: "#22D3EE" },
  "rocky-comet": { base: "#D1D5DB", glow: "#9CA3AF" },

  // Moons
  "rocky-moon": { base: "#8B7355", glow: "#D4A574" },
  "ice-moon": { base: "#B8E6F0", glow: "#22D3EE" },
  "crater-moon": { base: "#9CA3AF", glow: "#D1D5DB" },
  
  // Planets
  "gas-giant": { base: "#FFA07A", glow: "#FF6347", ring: "#FFD700" },
  "ice-planet": { base: "#87CEEB", glow: "#00CED1", ring: "#E0F2FE" },
  "rocky-planet": { base: "#CD853F", glow: "#DAA520", ring: "#F4A460" },
  
  // Orbs
  "energy-orb": { base: "#EC4899", glow: "#F472B6" },
  "plasma-orb": { base: "#8B5CF6", glow: "#A78BFA" },
  "star-orb": { base: "#FCD34D", glow: "#FBBF24" },
};

export function CelestialBody({
  type,
  variant,
  size = 80,
  progress = 100,
  locked = false,
  hasRing = false,
  color,
}: CelestialBodyProps) {
  const baseColors = variantColors[variant] || variantColors["rocky-moon"];
  const finalBase = color || baseColors.base;
  const finalGlow = color || baseColors.glow; // Use same color for glow if custom color is provided
  const opacity = progress / 100;

  if (locked) {
    return (
      <div
        className="relative rounded-full bg-purple-900/20 border-2 border-dashed border-purple-500/30 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-purple-400/50 text-2xl">🔒</div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {hasRing && (
        <div
          className="absolute top-1/2 left-1/2 rounded-full border-[6px] opacity-80 pointer-events-none"
          style={{
            width: size * 1.8,
            height: size * 0.4,
            borderStyle: 'solid',
            borderColor: baseColors.ring || finalGlow,
            transform: "translate(-50%, -50%) rotateX(70deg) rotateY(-15deg)",
            boxShadow: `0 0 10px ${baseColors.ring || finalGlow}`,
          }}
        />
      )}
      
      <motion.div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: finalBase,
          opacity: 0.2 + opacity * 0.8,
          boxShadow: `0 0 ${20 * opacity}px ${finalGlow}`,
        }}
        animate={{
          opacity: [0.2 + opacity * 0.8, 0.3 + opacity * 0.8, 0.2 + opacity * 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Surface details */}
        {variant.includes("crater") && (
          <>
            <div
              className="absolute rounded-full bg-black/20"
              style={{ top: "20%", left: "30%", width: "20%", height: "20%" }}
            />
            <div
              className="absolute rounded-full bg-black/15"
              style={{ top: "50%", left: "60%", width: "15%", height: "15%" }}
            />
          </>
        )}
        
        {type === "comet" && (
          <div
            className="absolute rounded-full opacity-60 pointer-events-none"
            style={{
               background: `linear-gradient(90deg, transparent, ${finalGlow})`,
               width: size * 1.5, height: size * 0.4,
               top: '50%', left: '50%', 
               transform: "translate(-10%, -50%) rotate(-25deg)",
               filter: "blur(4px)"
            }}
          />
        )}
        
        {type === "orb" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${finalGlow}, transparent)`,
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Progress overlay for charging */}
      {progress < 100 && (
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/40"
          style={{
            clipPath: `polygon(0 ${100 - progress}%, 100% ${100 - progress}%, 100% 100%, 0 100%)`,
          }}
        />
      )}
    </div>
  );
}
