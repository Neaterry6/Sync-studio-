import { Search, Music, Video, Image as ImageIcon, Sparkles, Upload, MoreVertical } from "lucide-react";
import { useState, useRef } from "react";
import { useTimelineStore } from "../../store/useTimelineStore";
import { audioEngine } from "../../lib/studio/audioEngine";

export function Library() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "audio" | "video" | "ai">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addClip, tracks } = useTimelineStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      
      // Load into audio engine
      await audioEngine.init();
      await audioEngine.loadTrack(file.name, url);

      // Find the "Main Beat" track or the first audio track
      const beatTrack = tracks.find(t => t.name === "Main Beat" && t.type === "audio") || 
                       tracks.find(t => t.type === "audio");
      
      if (beatTrack) {
        addClip(beatTrack.id, {
          name: file.name,
          type: 'audio',
          startTime: 0,
          duration: 30, // Default duration, in a real app we'd get this from the buffer
          sourceUrl: url
        });
      }
    }
  };

  const assets = [
    { id: "1", name: "Drum Loop 01.wav", size: "1.2 MB", type: "audio" },
    { id: "2", name: "Cinematic Intro.mp4", size: "45 MB", type: "video" },
    { id: "3", name: "Logo Final.png", size: "450 KB", type: "photo" },
  ];

  return (
    <div className="flex flex-col h-full bg-studio-bg border-r border-white/5">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="audio/*,video/*,image/*"
        onChange={handleFileUpload}
      />
      
      <div className="p-4 border-b border-white/5">
        <div className="bg-studio-surface/50 flex items-center px-3 py-2 rounded-xl border border-white/5 focus-within:border-studio-primary transition-colors">
          <Search size={14} className="text-slate-600" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs ml-2 outline-none text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex p-2 md:p-3 gap-1 border-b border-white/5 bg-studio-surface/20">
        {['all', 'audio', 'video', 'ai'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat as any)}
            className={`flex-1 py-1.5 text-[9px] uppercase font-bold rounded-lg transition-all ${category === cat ? 'bg-studio-primary text-white shadow-lg shadow-studio-primary/20' : 'bg-transparent text-slate-600 hover:text-slate-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AI Tools Section */}
      {(category === 'ai' || category === 'all') && (
        <div className="p-4 bg-gradient-to-br from-studio-primary/5 to-transparent border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-studio-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-studio-primary">Magic Tools</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <AIButton label="Suno AI" sub="Music" />
            <AIButton label="Coqui" sub="TTS" />
            <AIButton label="Whisper" sub="Captions" />
            <AIButton label="Rembg" sub="Remover" />
          </div>
        </div>
      )}

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="flex items-center justify-between px-2 mb-3 mt-2">
          <span className="text-[10px] uppercase font-bold text-slate-700 tracking-widest">Files</span>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-600 hover:text-white transition-colors"
          >
            <Upload size={14} />
          </button>
        </div>
        {assets.map(asset => (
          <div key={asset.id} className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-studio-surface/50 transition-all cursor-grab active:cursor-grabbing border border-transparent hover:border-white/5">
            <div className={`p-2 rounded-lg bg-black/40 group-hover:bg-studio-bg transition-colors ${asset.type === 'audio' ? 'text-studio-audio' : asset.type === 'video' ? 'text-studio-video' : 'text-studio-design'}`}>
              {asset.type === 'audio' ? <Music size={16} /> : asset.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold truncate text-slate-400 group-hover:text-slate-100 transition-colors">{asset.name}</div>
              <div className="text-[9px] text-slate-600 font-mono">{asset.size}</div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-white transition-opacity">
              <MoreVertical size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Quota display */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex justify-between text-[9px] text-slate-600 mb-2 font-bold uppercase tracking-widest">
           <span>Project Sync</span>
           <span className="text-studio-primary">0.4 / 10 GB</span>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-studio-primary shadow-[0_0_8px_rgba(124,58,237,0.5)] w-[4%]" />
        </div>
      </div>
    </div>
  );
}

function AIButton({ label, sub }: { label: string, sub: string }) {
  return (
    <button className="bg-studio-surface border border-white/5 hover:border-studio-primary/30 p-2 rounded-xl text-left transition-all group overflow-hidden relative">
      <div className="absolute inset-0 bg-studio-primary/0 group-hover:bg-studio-primary/5 transition-colors" />
      <span className="block text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
      <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter group-hover:text-studio-primary transition-colors">{sub}</span>
    </button>
  );
}
