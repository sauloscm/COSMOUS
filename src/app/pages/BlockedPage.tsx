import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { ShieldAlert } from "lucide-react";

export function BlockedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Star Simulation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-purple-900/20 backdrop-blur-xl p-8 rounded-3xl border border-pink-500/30 max-w-sm w-full shadow-[0_0_60px_-15px_rgba(236,72,153,0.3)]">
        <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="size-10 text-pink-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
          Interaction Blocked
        </h1>
        
        <p className="text-purple-200/80 text-sm mb-8 leading-relaxed">
          Your focus is currently building a new universe. Don't let distractions interrupt the creation of your stellar system.
        </p>

        <Button
          onClick={() => navigate('/')}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold shadow-lg shadow-purple-500/40"
        >
          Return to Orbit
        </Button>
      </div>
    </div>
  );
}
