import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Bounds, Trail, Line } from '@react-three/drei';
import * as THREE from 'three';

const Moon3D = ({ moon, parentSize, index }: { moon: any, parentSize: number, index: number }) => {
  const ref = useRef<THREE.Group>(null);
  const orbitRadius = parentSize * 1.5 + (moon.orbitRadius * 10);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const speed = 2 / (moon.speed || 3);
      ref.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[moon.size * 0.1, 16, 16]} />
        <meshStandardMaterial color={moon.color} emissive={moon.color} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};

const Planet3D = ({ planet, index }: { planet: any, index: number }) => {
  const ref = useRef<THREE.Group>(null);
  const orbitRadius = 5 + (planet.orbitRadius * 40); // Better spread
  
  const orbitPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius));
    }
    return pts;
  }, [orbitRadius]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const speed = 0.5 - (index * 0.05);
      ref.current.rotation.y = clock.getElapsedTime() * Math.max(speed, 0.1);
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[planet.size * 0.1, 32, 32]} />
        <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.2} roughness={0.7} />
        {planet.hasRing && (
           <mesh rotation={[-Math.PI / 3, 0, 0]}>
             <ringGeometry args={[planet.size * 0.15, planet.size * 0.25, 32]} />
             <meshStandardMaterial color={planet.color} transparent opacity={0.6} side={THREE.DoubleSide} />
           </mesh>
        )}
        {planet.moons && planet.moons.map((moon: any, mIndex: number) => (
          <Moon3D key={mIndex} moon={moon} parentSize={planet.size * 0.1} index={mIndex} />
        ))}
      </mesh>
      
      {/* Orbit path line */}
      <Line 
        points={orbitPoints} 
        color="#ffffff" 
        transparent 
        opacity={0.15} 
        dashed={true} 
        dashSize={0.5} 
        gapSize={0.5} 
        lineWidth={1} 
      />
    </group>
  );
};

const Comet3D = ({ comet, index }: { comet: any, index: number }) => {
  const ref = useRef<THREE.Group>(null);
  const orbitRadius = 15 + (comet.orbitRadius * 20) + (index * 2); 
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * (comet.speed || 5) * 0.2;
      ref.current.position.x = Math.cos(t) * orbitRadius * 1.5;
      ref.current.position.z = Math.sin(t) * orbitRadius * 0.5;
      ref.current.position.y = Math.sin(t * 1.5) * 10;
    }
  });

  return (
    <group ref={ref}>
      <Trail width={Math.max(0.5, comet.size * 0.3)} color={comet.color} length={100} decay={2} local={false}>
        <mesh>
          <sphereGeometry args={[comet.size * 0.15, 8, 8]} />
          <meshStandardMaterial color={comet.color} emissive={comet.color} emissiveIntensity={0.8} />
        </mesh>
      </Trail>
    </group>
  );
};

const SolarSystemGroup = ({ system }: { system: any }) => {
  return (
    <group position={[system.x || 0, system.y || 0, system.z || 0]}>
      {/* Central Star */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" />
        <pointLight color="#fbbf24" intensity={200} distance={150} />
      </mesh>
      {system.planets.map((planet: any, index: number) => (
        <Planet3D key={`planet-${index}`} planet={planet} index={index} />
      ))}
      {system.comets && system.comets.map((comet: any, index: number) => (
        <Comet3D key={`comet-${index}`} comet={comet} index={index} />
      ))}
    </group>
  );
};

export function Universe3D({ systems }: { systems: any[] }) {
  return (
    <div className="w-full h-full absolute inset-0 z-0 cursor-move">
      <Canvas camera={{ position: [0, 60, 120], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {systems.length > 0 ? (
          <Bounds fit clip margin={1.5}>
            {systems.map(system => (
              <SolarSystemGroup key={system.id} system={system} />
            ))}
          </Bounds>
        ) : null}

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} maxDistance={400} minDistance={5} />
      </Canvas>
    </div>
  );
}
