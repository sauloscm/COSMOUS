import { motion } from "motion/react";

interface Moon {
  variant: string;
  size: number;
  color: string;
  orbitRadius: number;
  speed?: number;
}

interface Planet {
  variant: string;
  orbitRadius: number;
  size: number;
  color: string;
  hasRing?: boolean;
  moons?: Moon[];
}

interface SolarSystemProps {
  planets: Planet[];
  size?: number;
}

export function SolarSystem({ planets, size = 200 }: SolarSystemProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Central star */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          boxShadow: "0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.4)",
        }}
        animate={{
          boxShadow: [
            "0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.4)",
            "0 0 40px rgba(250, 204, 21, 1), 0 0 80px rgba(250, 204, 21, 0.6)",
            "0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.4)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orbit paths and planets */}
      {planets.map((planet, index) => {
        const orbitSize = size * planet.orbitRadius;
        return (
          <div key={index}>
            {/* Orbit path */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-400/20"
              style={{
                width: orbitSize,
                height: orbitSize,
              }}
            />

            {/* Planet */}
            <motion.div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: planet.size,
                height: planet.size,
                backgroundColor: planet.color,
                boxShadow: `0 0 ${planet.size * 0.5}px ${planet.color}`,
              }}
              animate={{
                x: [
                  Math.cos(0) * (orbitSize / 2) - planet.size / 2,
                  Math.cos(Math.PI / 2) * (orbitSize / 2) - planet.size / 2,
                  Math.cos(Math.PI) * (orbitSize / 2) - planet.size / 2,
                  Math.cos((3 * Math.PI) / 2) * (orbitSize / 2) - planet.size / 2,
                  Math.cos(2 * Math.PI) * (orbitSize / 2) - planet.size / 2,
                ],
                y: [
                  Math.sin(0) * (orbitSize / 2) - planet.size / 2,
                  Math.sin(Math.PI / 2) * (orbitSize / 2) - planet.size / 2,
                  Math.sin(Math.PI) * (orbitSize / 2) - planet.size / 2,
                  Math.sin((3 * Math.PI) / 2) * (orbitSize / 2) - planet.size / 2,
                  Math.sin(2 * Math.PI) * (orbitSize / 2) - planet.size / 2,
                ],
              }}
              transition={{
                duration: 10 + index * 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {planet.moons && planet.moons.map((moon, mIndex) => {
                const moonOrbitSize = planet.size * 1.4 + (moon.orbitRadius * 40);
                return (
                  <motion.div
                    key={mIndex}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: moonOrbitSize, height: moonOrbitSize }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: moon.speed || (3 + mIndex), repeat: Infinity, ease: "linear" }}
                  >
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: moon.size,
                        height: moon.size,
                        backgroundColor: moon.color,
                        boxShadow: `0 0 ${moon.size * 0.5}px ${moon.color}`,
                        top: -moon.size / 2,
                        left: (moonOrbitSize / 2) - (moon.size / 2),
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
