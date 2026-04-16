import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Universe3D } from "../components/Universe3D";
import { Button } from "../components/ui/button";
import { Clock, CalendarDays, CalendarHeart, Globe, Calendar } from "lucide-react";

// Mock data removed in favor of real API data
export function ProgressPage() {
  const [universeState, setUniverseState] = useState({ totalFocusMinutes: 0, sessions: 0, systems: [] as any[] });
  const [timeFilter, setTimeFilter] = useState<"today"|"month"|"year"|"all">("all");

  useEffect(() => {
    fetch('/api/cosmos')
      .then(res => res.json())
      .then(data => setUniverseState(data))
      .catch(console.error);

    const eventSource = new EventSource('/api/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setUniverseState(data);
      } catch (e) {
        console.error("Error parsing stream data", e);
      }
    };
    return () => eventSource.close();
  }, []);

  const isInTimeRange = (dateString: string, filterValue: string, now: Date) => {
      if (!dateString) return true; // Fallback for old bodies
      if (filterValue === 'all') return true;
      const date = new Date(dateString);
      if (filterValue === 'today') {
          return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (filterValue === 'month') {
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (filterValue === 'year') {
          return date.getFullYear() === now.getFullYear();
      }
      return true;
  };

  const currentNow = new Date();
  const safeSystems = Array.isArray(universeState?.systems) ? universeState.systems : [];
  const filteredSystems = safeSystems.map(sys => {
      const safePlanets = Array.isArray(sys.planets) ? sys.planets : [];
      const filteredPlanets = safePlanets.map((planet: any) => {
          const validMoons = planet.moons ? planet.moons.filter((m: any) => isInTimeRange(m.createdAt, timeFilter, currentNow)) : [];
          return { ...planet, moons: validMoons };
      }).filter((planet: any) => isInTimeRange(planet.createdAt, timeFilter, currentNow) || planet.moons.length > 0);
      return { ...sys, planets: filteredPlanets };
  }).filter(sys => isInTimeRange(sys.createdAt, timeFilter, currentNow) || sys.planets.length > 0);

  const totalHours = Math.floor(universeState.totalFocusMinutes / 60);
  const totalMinutes = universeState.totalFocusMinutes % 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C0F45] to-[#0B132B] pb-24 overflow-hidden">
      {/* Top Discreet Stats */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400 mb-2 drop-shadow-lg">
          The Cosmos
        </h1>
        <div className="bg-[#0B132B]/60 rounded-full px-6 py-2 border border-purple-500/20 backdrop-blur-md flex items-center gap-6 pointer-events-auto shadow-lg">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-cyan-400" />
            <span className="text-sm font-semibold text-purple-100">
              {totalHours}h {totalMinutes}m
            </span>
          </div>
          <div className="w-px h-4 bg-purple-500/30"></div>
          <div className="flex items-center gap-4 text-xs font-medium text-purple-300">
            <span title="Systems"><span className="text-cyan-400 font-bold mr-1">{filteredSystems.length}</span> Sys</span>
            <span title="Bodies"><span className="text-purple-400 font-bold mr-1">{filteredSystems.reduce((acc, sys) => acc + (sys.planets ? sys.planets.reduce((pAcc: number, p: any) => pAcc + 1 + (p.moons ? p.moons.length : 0), 0) : 0), 0)}</span> Bod</span>
            <span title="Sessions"><span className="text-pink-400 font-bold mr-1">{universeState.sessions || 0}</span> Ses</span>
          </div>
        </div>
      </div>

      {/* Vertical Time Filters on the Left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto">
          <Button
            variant={timeFilter === "today" ? "default" : "outline"}
            onClick={() => setTimeFilter("today")}
            className={`w-32 justify-start text-xs h-9 shadow-lg backdrop-blur-md ${timeFilter === "today" ? "bg-cyan-600 hover:bg-cyan-500 border-none" : "bg-[#0B132B]/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"}`}
          >
            <CalendarDays className="size-4 mr-2" /> Today
          </Button>
          <Button
            variant={timeFilter === "month" ? "default" : "outline"}
            onClick={() => setTimeFilter("month")}
            className={`w-32 justify-start text-xs h-9 shadow-lg backdrop-blur-md ${timeFilter === "month" ? "bg-cyan-600 hover:bg-cyan-500 border-none" : "bg-[#0B132B]/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"}`}
          >
            <Calendar className="size-4 mr-2" /> Month
          </Button>
          <Button
            variant={timeFilter === "year" ? "default" : "outline"}
            onClick={() => setTimeFilter("year")}
            className={`w-32 justify-start text-xs h-9 shadow-lg backdrop-blur-md ${timeFilter === "year" ? "bg-cyan-600 hover:bg-cyan-500 border-none" : "bg-[#0B132B]/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"}`}
          >
            <CalendarHeart className="size-4 mr-2" /> Year
          </Button>
          <Button
            variant={timeFilter === "all" ? "default" : "outline"}
            onClick={() => setTimeFilter("all")}
            className={`w-32 justify-start text-xs h-9 shadow-lg backdrop-blur-md ${timeFilter === "all" ? "bg-cyan-600 hover:bg-cyan-500 border-none" : "bg-[#0B132B]/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"}`}
          >
            <Globe className="size-4 mr-2" /> All Time
          </Button>
      </div>

      {/* 3D Universe Renderer */}
      <div className="absolute inset-0 z-0">
         <Universe3D systems={filteredSystems} />
      </div>

      <Navigation />
    </div>
  );
}
