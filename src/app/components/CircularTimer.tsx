import { motion } from "motion/react";
import { CelestialBody } from "./CelestialBody";

interface CircularTimerProps {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  isActive: boolean;
}

export function CircularTimer({
  timeRemaining,
  totalTime,
  isActive,
}: CircularTimerProps) {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  
  // Dynamic Charging Calculation
  const elapsedMinutes = (totalTime - timeRemaining) / 60;
  const targetTotalMinutes = totalTime / 60;

  let bodyType: "comet" | "moon" | "planet" | "orb" = "comet";
  let bodyVariant = "ice-comet";

  if (!isActive) {
      // Preview what they will get if they complete it
      if (targetTotalMinutes >= 25) { bodyType = "planet"; bodyVariant = "rocky-planet"; }
      else if (targetTotalMinutes >= 10) { bodyType = "moon"; bodyVariant = "crater-moon"; }
      else { bodyType = "comet"; bodyVariant = "ice-comet"; }
  } else {
      // Live evaluation of what is currently forged
      if (elapsedMinutes >= 25) { bodyType = "planet"; bodyVariant = "gas-giant"; }
      else if (elapsedMinutes >= 10) { bodyType = "moon"; bodyVariant = "ice-moon"; }
      else { bodyType = "comet"; bodyVariant = "ice-comet"; }
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const radius = 140;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
      {/* SVG Progress Ring */}
      <svg
        className="absolute -rotate-90"
        width="320"
        height="320"
      >
        {/* Background ring */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          stroke="rgba(139, 92, 246, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress ring */}
        <motion.circle
          cx="160"
          cy="160"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center gap-4">
        {/* Celestial body being charged */}
        <CelestialBody
          type={bodyType}
          variant={bodyVariant}
          size={100}
          progress={progress}
        />
        
        {/* Timer display */}
        <div className="text-center">
          <div className="font-mono text-5xl font-bold text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-purple-300/60 text-sm mt-1">
            {isActive ? "Forging..." : "Ready to focus"}
          </div>
        </div>
      </div>
    </div>
  );
}
