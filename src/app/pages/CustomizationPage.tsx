import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { CelestialBody } from "../components/CelestialBody";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Lock } from "lucide-react";

interface CelestialItem {
  id: string;
  type: "moon" | "planet" | "orb";
  variant: string;
  name: string;
  unlocked: boolean;
  unlockRequirement?: string;
  hasRing?: boolean;
  color?: string;
  capacity?: number;
  timeCost?: number;
}

const celestialItems: CelestialItem[] = [
  // Fascinating Moons
  { id: "moon-1", type: "moon", variant: "crater-moon", name: "Lua", color: "#d1d5db", unlocked: true, timeCost: 10 },
  { id: "moon-2", type: "moon", variant: "rocky-moon", name: "Io", color: "#f59e0b", unlocked: true, timeCost: 10 },
  { id: "moon-3", type: "moon", variant: "ice-moon", name: "Europa", color: "#bae6fd", unlocked: true, timeCost: 10 },
  { id: "moon-4", type: "moon", variant: "gas-giant", name: "Titã", color: "#fb923c", unlocked: false, unlockRequirement: "5 hours", timeCost: 20 },
  { id: "moon-5", type: "moon", variant: "ice-moon", name: "Encélado", color: "#ffffff", unlocked: false, unlockRequirement: "10 hours", timeCost: 15 },
  { id: "moon-6", type: "moon", variant: "rocky-moon", name: "Tritão", color: "#bef264", unlocked: false, unlockRequirement: "15 hours", timeCost: 15 },
  { id: "moon-7", type: "moon", variant: "crater-moon", name: "Ganimedes", color: "#78716c", unlocked: false, unlockRequirement: "20 hours", timeCost: 25 },
  { id: "moon-8", type: "moon", variant: "crater-moon", name: "Calisto", color: "#44403c", unlocked: false, unlockRequirement: "30 hours", timeCost: 25 },
  { id: "moon-9", type: "moon", variant: "rocky-moon", name: "Miranda", color: "#9ca3af", unlocked: false, unlockRequirement: "40 hours", timeCost: 15 },
  { id: "moon-10", type: "moon", variant: "rocky-moon", name: "Caronte", color: "#fca5a5", unlocked: false, unlockRequirement: "50 hours", timeCost: 15 },
  
  // Famous Planets
  { id: "planet-1", type: "planet", variant: "rocky-planet", name: "Terra", color: "#3b82f6", unlocked: true, capacity: 1, timeCost: 30 },
  { id: "planet-2", type: "planet", variant: "gas-giant", name: "Saturno", color: "#fef08a", hasRing: true, unlocked: true, capacity: 5, timeCost: 60 },
  { id: "planet-3", type: "planet", variant: "gas-giant", name: "Júpiter", color: "#fdba74", unlocked: true, capacity: 5, timeCost: 60 },
  { id: "planet-4", type: "planet", variant: "rocky-planet", name: "Marte", color: "#ef4444", unlocked: true, capacity: 2, timeCost: 25 },
  { id: "planet-5", type: "planet", variant: "gas-giant", name: "Netuno", color: "#1d4ed8", unlocked: false, unlockRequirement: "25 hours", capacity: 3, timeCost: 40 },
  { id: "planet-6", type: "planet", variant: "rocky-planet", name: "Vênus", color: "#fcd34d", unlocked: false, unlockRequirement: "35 hours", capacity: 0, timeCost: 25 },
  { id: "planet-7", type: "planet", variant: "gas-giant", name: "Urano", color: "#67e8f9", hasRing: true, unlocked: false, unlockRequirement: "45 hours", capacity: 5, timeCost: 45 },
  { id: "planet-8", type: "planet", variant: "rocky-planet", name: "Kepler-186f", color: "#7f1d1d", unlocked: false, unlockRequirement: "60 hours", capacity: 2, timeCost: 70 },
  { id: "planet-9", type: "planet", variant: "star-orb", name: "55 Cancri e", color: "#fde047", unlocked: false, unlockRequirement: "80 hours", capacity: 0, timeCost: 90 },
  { id: "planet-10", type: "planet", variant: "ice-planet", name: "HD 189733 b", color: "#1e3a8a", unlocked: false, unlockRequirement: "100 hours", capacity: 2, timeCost: 120 },

  // Special Stars / Orbs
  { id: "orb-1", type: "orb", variant: "star-orb", name: "Yellow Dwarf", color: "#fbbf24", unlocked: true, capacity: 8 },
  { id: "orb-2", type: "orb", variant: "plasma-orb", name: "Blue Giant", color: "#60a5fa", unlocked: false, unlockRequirement: "120 hours", capacity: 12 },
  { id: "orb-3", type: "orb", variant: "energy-orb", name: "Red Supergiant", color: "#f87171", unlocked: false, unlockRequirement: "200 hours", capacity: 15 },
];

export function CustomizationPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<{variant: string, type: string} | null>(null);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);

  useEffect(() => {
    fetch('/api/cosmos')
      .then(res => res.json())
      .then(data => {
        setActiveTarget(data.activeTarget);
        setTotalMinutes(data.totalFocusMinutes || 0);
      })
      .catch(console.error);

    const eventSource = new EventSource('/api/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setActiveTarget(data.activeTarget);
        if (data.totalFocusMinutes !== undefined) {
            setTotalMinutes(data.totalFocusMinutes);
        }
      } catch (e) {}
    };
    return () => eventSource.close();
  }, []);

  const dynamicItems = celestialItems.map(item => {
    if (!item.unlockRequirement) return { ...item, unlocked: true };
    const requiredHours = parseInt(item.unlockRequirement.split(' ')[0], 10);
    const requiredMins = isNaN(requiredHours) ? 0 : requiredHours * 60;
    return { ...item, unlocked: totalMinutes >= requiredMins };
  });

  const handleSetTarget = async (item: CelestialItem) => {
    if (!item.unlocked) return;
    try {
      await fetch('/api/target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVariant: item.variant, targetType: item.type, targetName: item.name })
      });
      setSelectedItem(item.id);
    } catch (e) {
      console.error(e);
    }
  };

  const getItemsByType = (type: string) => dynamicItems.filter((item) => item.type === type);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C0F45] to-[#0B132B] pb-24">
      <div className="max-w-md mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            The Observatory
          </h1>
          <p className="text-purple-300/60 text-sm">Choose your celestial forms</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="moons" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-purple-900/30 mb-6">
            <TabsTrigger value="moons" className="data-[state=active]:bg-purple-500/30">
              Moons
            </TabsTrigger>
            <TabsTrigger value="planets" className="data-[state=active]:bg-purple-500/30">
              Planets
            </TabsTrigger>
            <TabsTrigger value="orbs" className="data-[state=active]:bg-purple-500/30">
              Orbs
            </TabsTrigger>
          </TabsList>

          {/* Moons */}
          <TabsContent value="moons" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {getItemsByType("moon").map((item) => (
                <CelestialCard
                  key={item.id}
                  item={item}
                  isTarget={activeTarget?.variant === item.variant && activeTarget?.name === item.name}
                  selected={selectedItem === item.id}
                  onSelect={() => handleSetTarget(item)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Planets */}
          <TabsContent value="planets" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {getItemsByType("planet").map((item) => (
                <CelestialCard
                  key={item.id}
                  item={item}
                  isTarget={activeTarget?.variant === item.variant && activeTarget?.name === item.name}
                  selected={selectedItem === item.id}
                  onSelect={() => handleSetTarget(item)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Orbs */}
          <TabsContent value="orbs" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {getItemsByType("orb").map((item) => (
                <CelestialCard
                  key={item.id}
                  item={item}
                  isTarget={activeTarget?.variant === item.variant && activeTarget?.name === item.name}
                  selected={selectedItem === item.id}
                  onSelect={() => handleSetTarget(item)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
}

function CelestialCard({
  item,
  selected,
  isTarget,
  onSelect,
}: {
  item: CelestialItem;
  selected: boolean;
  isTarget: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={item.unlocked ? onSelect : undefined}
      className={`relative bg-purple-900/20 rounded-2xl p-6 border-2 transition-all ${
        selected
          ? "border-cyan-400 shadow-lg shadow-cyan-400/30"
          : "border-purple-500/20 hover:border-purple-400/40"
      } ${!item.unlocked ? "opacity-60" : ""}`}
    >
      <div className="flex justify-center mb-3">
        <CelestialBody
          type={item.type}
          variant={item.variant}
          size={80}
          locked={!item.unlocked}
          hasRing={item.hasRing}
          color={item.color}
        />
      </div>
      
      <div className="text-center">
        <h3 className="text-purple-100 font-semibold text-sm mb-1">{item.name}</h3>
        
        {!item.unlocked && item.unlockRequirement && (
          <div className="flex items-center justify-center gap-1 text-xs text-purple-400/70">
            <Lock className="size-3" />
            <span>{item.unlockRequirement}</span>
          </div>
        )}

        {(selected || isTarget) && (
          <div className="mt-2 flex flex-col gap-1 items-center justify-center text-[10px] text-purple-300/80 font-medium tracking-wide">
            {item.capacity !== undefined && (
              <span className="bg-purple-900/40 px-2 py-0.5 rounded-sm border border-purple-800/50">
                Capacidade: {item.capacity} {item.type === 'orb' ? 'Planetas' : 'Luas'}
              </span>
            )}
            {item.timeCost !== undefined && (
              <span className="bg-pink-900/30 px-2 py-0.5 rounded-sm border border-pink-800/50 text-pink-300/80">
                ⏳ {item.timeCost}m Foco
              </span>
            )}
          </div>
        )}
      </div>

      {isTarget && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-pink-900 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg shadow-pink-500/50">
          Target Goal
        </div>
      )}

      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/50">
          <svg className="w-4 h-4 text-[#0B132B]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}
