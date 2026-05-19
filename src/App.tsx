import { useState, useEffect } from "react";
import { Sidebar } from "./components/studio/Sidebar";
import { Timeline } from "./components/studio/Timeline";
import { Toolbar } from "./components/studio/Toolbar";
import { Mixer } from "./components/studio/Mixer";
import { Library } from "./components/studio/Library";
import { Preview } from "./components/studio/Preview";
import { UserModal } from "./components/studio/UserModal";
import { GuidedTour } from "./components/studio/GuidedTour";
import { motion, AnimatePresence } from "motion/react";
import { Download, Music, Play, SkipBack, SkipForward, SlidersHorizontal, Square, RotateCcw, RotateCw, Zap } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useThemeStore } from "./store/useThemeStore";
import { useTimelineStore } from "./store/useTimelineStore";
import { audioEngine } from "./lib/studio/audioEngine";

import { AdminDashboard } from "./components/admin/AdminDashboard";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
}

export default function App() {
  const { user, login } = useAuth();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isAdminPath = window.location.pathname === "/admin";
  const { isPlaying, setIsPlaying, currentTime, setCurrentTime, tracks, addClip } = useTimelineStore();
  const [activeTab, setActiveTab] = useState<"audio" | "video" | "photo" | "design">("audio");
  const [showMixer, setShowMixer] = useState(false);
  const [showLibrary, setShowLibrary] = useState(() => typeof window === "undefined" ? true : window.innerWidth >= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [recordWithPlayback, setRecordWithPlayback] = useState(true);
  const [recordingStartTime, setRecordingStartTime] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);


  useEffect(() => {
    const syncPanelsToViewport = () => {
      if (window.innerWidth < 768) {
        setShowLibrary(false);
      }
    };

    syncPanelsToViewport();
    window.addEventListener('resize', syncPanelsToViewport);
    return () => window.removeEventListener('resize', syncPanelsToViewport);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsAppInstalled(true);
    };

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsAppInstalled(isStandalone);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('studio_one_visits') || '0');
    if (visits < 3) {
      setShowTour(true);
      localStorage.setItem('studio_one_visits', (visits + 1).toString());
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(audioEngine.currentTime);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime]);

  const handleTogglePlay = async () => {
    if (!isPlaying) {
      await audioEngine.init();
      audioEngine.play();
      setIsPlaying(true);
    } else {
      audioEngine.stop();
      setIsPlaying(false);
    }
  };

  const handleToggleMic = async () => {
    await audioEngine.init();
    const active = await audioEngine.toggleMic();
    setMicActive(active);
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
      setIsAppInstalled(true);
    }
  };

  const handleToggleRecord = async () => {
    if (!isRecording) {
      if (!micActive) await handleToggleMic();
      setRecordingStartTime(currentTime);
      audioEngine.startRecording();
      setIsRecording(true);
      if (recordWithPlayback) {
        setIsPlaying(true);
        audioEngine.play();
      }
    } else {
      const blob = await audioEngine.stopRecording();
      setIsRecording(false);
      setIsPlaying(false);
      audioEngine.stop();
      
      if (blob) {
        const armedTracks = tracks.filter(t => t.armed && t.type === 'audio');
        if (armedTracks.length > 0) {
          armedTracks.forEach(track => {
            addClip(track.id, {
              name: `Recording ${track.clips.length + 1}`,
              startTime: recordingStartTime,
              duration: currentTime - recordingStartTime,
              type: 'audio',
              sourceUrl: URL.createObjectURL(blob),
              volume: 0,
              offset: 0
            });
          });
        } else {
          // Fallback to first audio track if none armed
          const vocalTrack = tracks.find(t => t.type === 'audio') || tracks[0];
          addClip(vocalTrack.id, {
            name: `Recording ${vocalTrack.clips.length + 1}`,
            startTime: recordingStartTime,
            duration: currentTime - recordingStartTime,
            type: 'audio',
            sourceUrl: URL.createObjectURL(blob),
            volume: 0,
            offset: 0
          });
        }
      }
    }
  };

  if (isAdminPath) {
    return <AdminDashboard />;
  }

  return (
    <div id="studio-app" className="flex h-[100dvh] min-h-[520px] bg-studio-bg text-white font-sans selection:bg-studio-primary/70 selection:text-white overflow-hidden">
      {/* Sidebar - Navigation (Top/Side on Desktop, Bottom on Mobile) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onProfile={() => setShowProfile(true)} 
        onSettings={() => setShowSettings(true)} 
        isVisible={showSidebar}
      />

      {/* Main Workspace */}
      <main className={`flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300 pb-16 md:pb-0 ${showSidebar ? 'md:pl-16' : 'md:pl-0'}`}>
        {/* Auth Overlay if not logged in */}
        {!user && (
          <div className="absolute inset-0 bg-studio-bg/95 z-[100] flex flex-col items-center justify-center px-6 py-10 text-center overflow-y-auto">
             <div className="w-20 h-20 bg-studio-primary rounded-2xl flex items-center justify-center font-bold text-white text-4xl mb-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
               S1
             </div>
             <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4 uppercase">Studio One</h1>
             <p className="text-slate-400 max-w-md mb-8">
               A unified professional studio for music, video, and design. 
               Sign in to sync your projects and access cloud tools.
             </p>
             <div className="flex w-full max-w-md flex-col sm:flex-row gap-4">
               <button 
                 onClick={login}
                 className="bg-studio-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-studio-primary-hover transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
               >
                 Launch Experience
               </button>
               <button 
                 onClick={() => {
                   login();
                   setShowTour(true);
                 }}
                 className="bg-studio-surface border border-white/10 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-studio-hover transition-all hover:scale-105 active:scale-95"
               >
                 Take a Tour
               </button>
               {installPrompt && !isAppInstalled && (
                 <button
                   onClick={handleInstallApp}
                   className="inline-flex items-center justify-center gap-2 bg-white text-studio-bg px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-slate-200 transition-all hover:scale-105 active:scale-95"
                 >
                   <Download size={16} />
                   Install App
                 </button>
               )}
             </div>
             <p className="mt-8 text-[10px] uppercase tracking-widest text-slate-700">
               v1.2.0 Stable | Professional Edition
             </p>
          </div>
        )}

        {/* Top bar - Project info & Global Controls */}
        <Toolbar 
          onToggleSidebar={() => setShowSidebar(!showSidebar)} 
          onToggleLibrary={() => setShowLibrary(!showLibrary)}
          showLibrary={showLibrary}
          onInstallApp={installPrompt && !isAppInstalled ? handleInstallApp : undefined}
        />

        {/* Dynamic Center Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Asset Library (Left Drawer style) */}
          <AnimatePresence>
            {showLibrary && (
              <motion.div
                id="library-sidebar"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="absolute inset-x-2 top-2 h-[44dvh] min-h-[260px] max-h-[420px] rounded-2xl border border-white/10 bg-studio-surface overflow-hidden flex flex-col z-40 shadow-2xl md:relative md:inset-auto md:h-auto md:min-h-0 md:max-h-none md:w-[300px] md:max-w-[32vw] md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:border-white/5 md:bg-studio-surface md:shadow-none"
              >
                <Library />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Column: Preview & Timeline */}
          <div className="flex-1 flex flex-col min-w-0 bg-studio-bg">
            {/* Preview Window (Top half) */}
            <div className="min-h-[150px] flex-[1_1_44%] relative bg-studio-bg flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
              <Preview type={activeTab} />
            </div>

            {/* Timeline (Bottom half) */}
            <div className="h-[46svh] min-h-[220px] max-h-[390px] md:h-[350px] border-t border-white/5 bg-studio-surface/40 flex flex-col">
              <Timeline currentTime={currentTime} setCurrentTime={setCurrentTime} />
            </div>
          </div>
        </div>

        {/* Mixer (Bottom Overlay/Panel) */}
        <AnimatePresence>
          {showMixer && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'min(420px, 70dvh)' }}
              exit={{ height: 0 }}
              className="absolute md:relative bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-studio-surface overflow-hidden shadow-2xl md:shadow-none"
            >
              <Mixer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Transport Bar - Modern Floating Style */}
        <footer id="transport-bar" className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-studio-surface/85 backdrop-blur-2xl px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 max-w-[calc(100vw-1rem)] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
            <button className={`text-slate-500 hover:text-white transition-colors ${showMixer ? 'text-studio-primary' : ''}`} onClick={() => setShowMixer(!showMixer)}>
              <SlidersHorizontal size={18} className="md:w-[20px] md:h-[20px]" />
            </button>
            <button className="hidden md:block text-slate-500 hover:text-white transition-colors" onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}>
              <RotateCcw size={20} />
            </button>
            
            <div className="flex items-center gap-2 md:gap-3">
              <button className="text-slate-500 hover:text-white transition-colors" onClick={() => setCurrentTime(0)}>
                <SkipBack size={20} className="md:w-[24px] md:h-[24px]" fill="currentColor" />
              </button>
              
              <button 
                id="transport-record"
                onClick={handleToggleRecord}
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-white text-studio-primary scale-110 shadow-[0_0_24px_rgba(255,255,255,0.22)]' 
                    : micActive
                    ? 'bg-studio-primary text-white scale-105 shadow-[0_0_20px_rgba(139,155,180,0.35)] animate-pulse'
                    : 'bg-studio-primary text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,155,180,0.28)]'
                }`}
              >
                {isRecording ? <Square size={20} className="md:w-[24px] md:h-[24px]" fill="currentColor" /> : <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full" />}
              </button>

              <button 
                onClick={handleTogglePlay}
                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all ${
                  isPlaying ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {isPlaying ? <Square size={18} className="md:w-[20px] md:h-[20px]" fill="currentColor" /> : <Play size={20} className="md:w-[24px] md:h-[24px] ml-1" fill="currentColor" />}
              </button>

              <button className="text-slate-500 hover:text-white transition-colors" onClick={() => setCurrentTime(currentTime + 5)}>
                <SkipForward size={20} className="md:w-[24px] md:h-[24px]" fill="currentColor" />
              </button>
            </div>

            <button className="hidden md:block text-slate-500 hover:text-white transition-colors" onClick={() => setCurrentTime(currentTime + 5)}>
              <RotateCw size={20} />
            </button>
            <button className={`${micActive ? 'text-studio-primary' : 'text-slate-500'} hover:text-white transition-colors`} onClick={handleToggleMic}>
              <Zap size={18} className="md:w-[20px] md:h-[20px]" />
            </button>

            <div className="h-6 w-px bg-white/10 hidden md:block" />

            <button 
              onClick={() => setRecordWithPlayback(!recordWithPlayback)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                recordWithPlayback 
                  ? 'bg-studio-primary/10 border-studio-primary/50 text-studio-primary' 
                  : 'bg-studio-surface border-white/5 text-slate-500'
              }`}
            >
              <Music size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Playback</span>
            </button>
          </div>
        </footer>

        {/* Modals */}
        <AnimatePresence>
          {showProfile && <UserModal type="profile" onClose={() => setShowProfile(false)} />}
          {showSettings && <UserModal type="settings" onClose={() => setShowSettings(false)} />}
        </AnimatePresence>

        {showTour && <GuidedTour onComplete={() => setShowTour(false)} />}
      </main>
    </div>
  );
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}
