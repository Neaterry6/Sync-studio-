import { FolderOpen, Save, Cloud, CloudOff, Share2, Plus, ChevronDown, SkipBack, Music, Settings, Menu } from "lucide-react";
import { useProject } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { useTimelineStore } from "../../store/useTimelineStore";
import { useRef } from "react";

interface ToolbarProps {
  onToggleSidebar?: () => void;
  onToggleLibrary?: () => void;
  showLibrary?: boolean;
}

export function Toolbar({ onToggleSidebar, onToggleLibrary, showLibrary }: ToolbarProps) {
  const { project, saveProject, createNew } = useProject();
  const { user } = useAuth();
  const { tracks, addClip, addTrack, currentTime } = useTimelineStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isOnline = !!user;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const type = file.type.split('/')[0] as 'audio' | 'video' | 'image';
      // Find a track of matching type
      let targetTrack = tracks.find(t => t.type === type && (t.armed || t.name.toLowerCase().includes('beat')));
      if (!targetTrack) targetTrack = tracks.find(t => t.type === type);
      
      if (targetTrack) {
        addClip(targetTrack.id, {
          name: file.name,
          duration: type === 'audio' ? 180 : 10, // Mock longer duration for audio
          startTime: currentTime, // Import at current playhead
          type,
          sourceUrl: URL.createObjectURL(file),
          volume: 0,
          offset: 0
        });
      } else {
        // Create new track if none exists
        addTrack(type);
        // We'll need a way to get the newly created track ID, 
        // but for now let's just use the tracks[0] as absolute fallback
        const fallback = tracks.find(t => t.type === type) || tracks[0];
        addClip(fallback.id, {
          name: file.name,
          duration: type === 'audio' ? 180 : 10,
          startTime: currentTime,
          type,
          sourceUrl: URL.createObjectURL(file),
          volume: 0,
          offset: 0
        });
      }
    });
  };

  return (
    <header id="toolbar-main" className="h-16 border-b border-white/5 bg-studio-bg flex items-center justify-between px-6 z-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple
        accept="audio/*,video/*,image/*"
        onChange={handleImport}
      />
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-studio-hover rounded-lg text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/5"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
        <button 
          onClick={onToggleLibrary}
          className={`p-2 hover:bg-studio-hover rounded-lg transition-colors border border-transparent hover:border-white/5 ${showLibrary ? 'text-studio-primary bg-studio-primary/10' : 'text-slate-400'}`}
          title="Toggle Library"
        >
          <FolderOpen size={20} />
        </button>
        <div className="h-4 w-px bg-white/5 mx-1" />
        <button className="p-2 hover:bg-studio-hover rounded-full text-slate-400 transition-colors">
          <SkipBack size={20} />
        </button>
        <div className="font-mono text-xs text-slate-500 tabular-nums">00:00.5</div>
      </div>

      <div className="flex items-center bg-studio-surface border border-white/5 p-1 rounded-xl gap-1">
        <div className="flex items-center px-3 py-1.5 gap-2 border-r border-white/5 group relative">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">BPM</span>
          <span className="text-xs font-mono font-bold text-studio-primary tabular-nums">128.0</span>
          <div className="absolute top-full left-0 mt-1 w-32 bg-studio-surface border border-white/5 rounded-lg p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            <input type="range" min="60" max="200" defaultValue="128" className="w-full accent-studio-primary bg-black/40 rounded-full h-1 appearance-none" />
          </div>
        </div>
        <div className="flex items-center px-3 py-1.5 gap-2 group relative">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Key</span>
          <span className="text-xs font-bold text-studio-primary">C min</span>
          <div className="absolute top-full right-0 mt-1 w-48 bg-studio-surface border border-white/5 rounded-lg p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 grid grid-cols-4 gap-1">
             {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(k => (
               <button key={k} className="text-[10px] p-1 hover:bg-studio-primary/20 rounded transition-colors">{k}</button>
             ))}
          </div>
        </div>
      </div>

      <div className="flex items-center bg-black/40 border border-white/5 p-1 rounded-full gap-1">
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold transition-all">
          <Music size={14} />
          <span className="hidden sm:inline">Track</span>
        </button>
        <button 
          id="toolbar-import" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-slate-400 hover:text-white text-xs font-bold transition-all hover:bg-white/5"
        >
          <FolderOpen size={14} />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-slate-500 hover:text-white text-xs font-bold transition-all">
          <Plus size={14} />
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-slate-500 hover:text-white text-xs font-bold transition-all">
          <Settings size={14} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-studio-hover rounded-full text-slate-400 transition-colors relative">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-studio-primary rounded-full" />
          <Cloud size={20} />
        </button>
      </div>
    </header>
  );
}
