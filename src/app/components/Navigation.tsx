import { Link, useLocation } from "react-router";
import { Timer, Sparkles, Map, Settings } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const links = [
    { path: "/", icon: Timer, label: "Focus" },
    { path: "/customize", icon: Sparkles, label: "Observatory" },
    { path: "/progress", icon: Map, label: "Cosmos" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0B132B] border-t border-purple-900/30 backdrop-blur-lg">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-4">
        {links.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "text-cyan-400"
                  : "text-purple-300/50 hover:text-purple-300"
              }`}
            >
              <Icon
                className={`size-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : ""}`}
              />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
