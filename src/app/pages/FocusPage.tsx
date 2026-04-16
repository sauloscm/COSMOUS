import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { CircularTimer } from "../components/CircularTimer";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Trash2, Lock } from "lucide-react";
import { useTimer } from "../context/TimerContext";

export function FocusPage() {
  const {
    focusMinutes,
    setFocusMinutes,
    isActive,
    timeRemaining,
    startTimer,
    stopTimer,
    browserLocked,
    setBrowserLocked
  } = useTimer();
  
  const [universeState, setUniverseState] = useState({ totalFocusMinutes: 0, sessions: 0, systems: [] });

  useEffect(() => {
    // Initial fetch to ensure stats appear instantly
    fetch('/api/cosmos')
      .then(res => res.json())
      .then(data => {
        if (data && data.systems) setUniverseState(data);
      })
      .catch(console.error);

    const eventSource = new EventSource('/api/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.systems) setUniverseState(data);
      } catch (e) {
        console.error("Error parsing stream data", e);
      }
    };
    return () => eventSource.close();
  }, []);

  const handleStart = () => {
    startTimer();
  };

  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit? Your celestial body will turn to stardust...")) {
      stopTimer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C0F45] to-[#0B132B] pb-24">
      <div className="max-w-md mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            COSMOUS
          </h1>
          <p className="text-purple-300/60 text-sm">Forge your universe through focus</p>
        </div>

        {/* Time customization */}
        {!isActive && (
          <div className="mb-12 bg-purple-900/20 rounded-2xl p-6 border border-purple-500/20">
            <label className="text-purple-200 text-sm font-medium mb-3 block">
              Focus Duration: {focusMinutes} minutes
            </label>
            <Slider
              value={[focusMinutes]}
              onValueChange={(value) => setFocusMinutes(value[0])}
              min={5}
              max={120}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-400/60 mt-2">
              <span>5 min</span>
              <span>120 min</span>
            </div>
          </div>
        )}

        {/* Timer */}
        <div className="flex justify-center mb-8">
          <CircularTimer
            timeRemaining={timeRemaining}
            totalTime={focusMinutes * 60}
            isActive={isActive}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg shadow-purple-500/50"
            >
              Start Orbit
            </Button>
          ) : (
            <Button
              onClick={handleQuit}
              variant="outline"
              className="w-full h-14 text-lg font-semibold border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="size-5 mr-2" />
              Abort Mission
            </Button>
          )}

          {/* Browser lock toggle */}
          <div className="flex items-center justify-between bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-purple-300" />
              <span className="text-purple-200">Lock Browser</span>
            </div>
            <Switch
              checked={browserLocked}
              onCheckedChange={setBrowserLocked}
            />
          </div>
          
          {browserLocked && (
            <p className="text-xs text-purple-400/60 text-center">
              Browser locking is simulated in this demo
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {(universeState.systems || []).reduce((acc: number, sys: any) => acc + (sys.planets || []).reduce((pAcc: number, p: any) => pAcc + (p.moons ? p.moons.length : 0), 0), 0)}
            </div>
            <div className="text-xs text-purple-300/60 mt-1">Moons</div>
          </div>
          <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {(universeState.systems || []).reduce((acc: number, sys: any) => acc + (sys.planets ? sys.planets.length : 0), 0)}
            </div>
            <div className="text-xs text-purple-300/60 mt-1">Planets</div>
          </div>
          <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-pink-400">
              {(universeState.systems || []).length}
            </div>
            <div className="text-xs text-purple-300/60 mt-1">Systems</div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
