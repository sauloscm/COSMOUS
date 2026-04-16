import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Trash2, Shield, Globe } from "lucide-react";

export function SettingsPage() {
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [extensionReady, setExtensionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleExtensionReady = () => setExtensionReady(true);
    window.addEventListener("COSMOS_EXTENSION_READY", handleExtensionReady as EventListener);
    
    if (localStorage.getItem("cosmos_extension_ready")) {
      setExtensionReady(true);
    }

    const saved = localStorage.getItem("cosmos_blocked_urls");
    if (saved) {
      const parsedUrls = JSON.parse(saved);
      setBlockedUrls(parsedUrls);
      // Sync on load
      window.postMessage({ type: "COSMOS_UPDATE_BLOCKLIST", urls: parsedUrls }, "*");
    }

    return () => window.removeEventListener("COSMOS_EXTENSION_READY", handleExtensionReady as EventListener);
  }, []);

  const saveUrls = (urls: string[]) => {
    setBlockedUrls(urls);
    localStorage.setItem("cosmos_blocked_urls", JSON.stringify(urls));
    window.postMessage({ type: "COSMOS_UPDATE_BLOCKLIST", urls }, "*");
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim() && !blockedUrls.includes(newUrl.trim())) {
      saveUrls([...blockedUrls, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    saveUrls(blockedUrls.filter((url) => url !== urlToRemove));
  };

  const handleTestNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    const url = testUrl.trim();
    if (!url) return;

    // Check if the url matches any blocked ones
    const isBlocked = blockedUrls.some((blocked) => url.includes(blocked));
    
    if (isBlocked) {
      navigate('/blocked');
    } else {
      alert(`Simulated: You successfully navigated to ${url}.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C0F45] to-[#0B132B] pb-24 text-white">
      <div className="max-w-md mx-auto px-6 pt-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Settings
          </h1>
          <p className="text-purple-300/60 text-sm">Configure your universe parameters</p>
        </div>

        {/* Distraction Blocker Section */}
        <div className="bg-purple-900/20 rounded-2xl p-6 border border-purple-500/20 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-pink-400 size-6" />
            <h2 className="text-lg font-semibold text-purple-200">Distraction Blocker</h2>
          </div>
          
          {!extensionReady ? (
            <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3 mb-6 text-xs text-red-200 leading-relaxed">
              <span className="font-bold">⚠️ Extension Missing:</span> The browser strictly forbids websites from blocking other tabs. To activate cross-tab blocking, load the included <code>/extension</code> folder onto <code>chrome://extensions</code> in Developer mode.
            </div>
          ) : (
            <div className="bg-green-900/40 border border-green-500/50 rounded-lg p-3 mb-6 flex items-center gap-2 text-xs text-green-200">
              <span className="text-lg">🛡️</span>
              <span><strong>Extension Connected:</strong> Background distraction blocking is active across all tabs!</span>
            </div>
          )}

          <p className="text-xs text-purple-300/60 mb-6">
            Add websites that distract you. Accessing them will forcibly redirect you to the blocked zone.
          </p>

          <form onSubmit={handleAddUrl} className="flex gap-2 mb-6">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="e.g. facebook.com"
              className="bg-[#0B132B]/50 border-purple-500/30 text-white placeholder:text-purple-300/30"
            />
            <Button type="submit" className="bg-purple-600 hover:bg-purple-500 shrink-0">
              Add
            </Button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {blockedUrls.length === 0 ? (
              <p className="text-center text-sm text-purple-400/50 py-4">No blocked sites yet.</p>
            ) : (
              blockedUrls.map((url) => (
                <div key={url} className="flex items-center justify-between bg-[#0B132B]/60 p-3 rounded-lg border border-purple-500/10">
                  <span className="text-sm text-purple-200">{url}</span>
                  <button
                    onClick={() => handleRemoveUrl(url)}
                    className="text-red-400/70 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Simulator Section */}
        <div className="bg-cyan-900/10 rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-cyan-400 size-6" />
            <h2 className="text-lg font-semibold text-cyan-200">Test Navigation</h2>
          </div>
          <p className="text-xs text-cyan-300/60 mb-4">
            Simulate accessing a URL to test if the blocker is working properly.
          </p>

          <form onSubmit={handleTestNavigate} className="flex gap-2">
            <Input
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Enter a URL to visit"
              className="bg-[#0B132B]/50 border-cyan-500/30 text-white placeholder:text-cyan-300/30"
            />
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 shrink-0">
              Go
            </Button>
          </form>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
