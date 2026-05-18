import { useMemo, useRef, useEffect, useState } from "react";
import { Plus, Volume2, Video, Type, Image as ImageIcon, Mic, X, Settings2, Trash2 } from "lucide-react";
import { useTimelineStore } from "../../store/useTimelineStore";
import { motion, AnimatePresence } from "motion/react";

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { tracks, currentTime, zoom, setZoom, updateClip, removeClip, updateTrack } = useTimelineStore();
  const [editingClip, setEditingClip] = useState<{trackId: string, clipId: string} | null>(null);

  const getTrackColor = (type: string) => {
    switch (type) {
      case 'audio': return 'bg-studio-primary/40 border-studio-primary/80 text-white';
      case 'video': return 'bg-studio-video/20 border-studio-video/50 text-studio-video';
      case 'image': return 'bg-studio-design/20 border-studio-design/50 text-studio-design';
      default: return 'bg-slate-800/20 border-slate-500/50 text-slate-400';
    }
  };

  const selectedClip = useMemo(() => {
    if (!editingClip) return null;
    const track = tracks.find(t => t.id === editingClip.trackId);
    return track?.clips.find(c => c.id === editingClip.clipId);
  }, [editingClip, tracks]);

  return (
    <div id="timeline-area" className="flex-1 overflow-hidden flex flex-col">
      {/* Current Track Label Info */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-white/5 bg-studio-bg shrink-0">
        <div className="flex items-center gap-2">
          <Mic size={14} className="text-studio-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {tracks.find(t => t.armed)?.name || "No track armed"}
          </span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-bold uppercase">Zoom</span>
              <input 
                type="range" 
                min="20" 
                max="200" 
                value={zoom} 
                onChange={(e) => setZoom(parseInt(e.target.value))}
                className="w-24 accent-studio-primary bg-white/5 rounded-full h-1 appearance-none"
              />
           </div>
           <button className="text-slate-600 hover:text-white transition-colors">
             <Settings2 size={16} />
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Track info sidebar */}
        <div className="hidden sm:flex w-48 border-r border-white/5 flex-col bg-studio-bg shrink-0">
          <div className="h-8 border-b border-white/5 flex items-center px-4 justify-between bg-studio-surface/30">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Tracks</span>
            <button className="text-slate-600 hover:text-white transition-colors"><Plus size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto track-sidebar-scroll">
            {tracks.map(track => (
              <div key={track.id} className="h-16 border-b border-white/5 p-3 flex flex-col justify-center gap-1 hover:bg-studio-hover transition-colors group">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[100px] text-slate-400 group-hover:text-slate-200 transition-colors font-medium">{track.name}</span>
                  <button 
                    onClick={() => updateTrack(track.id, { armed: !track.armed })}
                    className={`p-1 rounded transition-colors ${track.armed ? 'text-studio-primary bg-studio-primary/10' : 'text-slate-700 hover:text-slate-500'}`}
                  >
                    <Mic size={10} fill={track.armed ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${track.armed ? 'bg-studio-primary animate-pulse' : 'bg-slate-700'}`} />
                  <div className="h-1 flex-1 bg-black/40 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-studio-primary/40 transition-all" 
                       style={{ width: `${Math.max(0, 100 + (track.volume * 2))}%` }} 
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main timeline area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-studio-bg relative">
          {/* Clip Editor Popover */}
          <AnimatePresence>
            {editingClip && selectedClip && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                className="absolute top-10 left-10 z-[100] w-64 bg-studio-surface border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Edit Clip</span>
                  <button onClick={() => setEditingClip(null)} className="p-1 hover:bg-white/5 rounded-full"><X size={14} /></button>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 block">Name</span>
                    <input 
                      type="text" 
                      value={selectedClip.name}
                      onChange={(e) => updateClip(editingClip.trackId, editingClip.clipId, { name: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-studio-primary/50"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-slate-600">Gain (dB)</span>
                      <span className="text-[10px] font-mono text-studio-primary">{selectedClip.volume > 0 ? '+' : ''}{selectedClip.volume}</span>
                    </div>
                    <input 
                      type="range" 
                      min="-40" 
                      max="12" 
                      step="1"
                      value={selectedClip.volume}
                      onChange={(e) => updateClip(editingClip.trackId, editingClip.clipId, { volume: parseInt(e.target.value) })}
                      className="w-full accent-studio-primary bg-black/40 rounded-full h-1 appearance-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => {
                      removeClip(editingClip.trackId, editingClip.clipId);
                      setEditingClip(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-danger/10 text-danger rounded-xl text-[10px] font-bold uppercase hover:bg-danger/20 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete Clip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ruler */}
          <div className="h-8 border-b border-white/5 bg-studio-surface/20 relative overflow-hidden shrink-0" ref={scrollRef}>
            <div className="absolute inset-0 flex items-end">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 border-l border-white/5 h-2 relative" style={{ width: zoom }}>
                  <span className="absolute -top-6 left-1 text-[9px] text-slate-600 font-mono">
                    {i}:00
                  </span>
                  <div className="absolute left-1/2 h-1 border-l border-white/5" />
                </div>
              ))}
            </div>
          </div>

          {/* Tracks background grid */}
          <div className="flex-1 overflow-auto relative custom-scrollbar">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundSize: `${zoom}px 64px`, backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)' }}>
            </div>

            <div className="flex flex-col">
              {tracks.map(track => (
                <div key={track.id} className="h-16 border-b border-white/5 relative group">
                  {track.clips.map(clip => (
                    <motion.div 
                      key={clip.id}
                      drag="x"
                      dragMomentum={false}
                      onDragEnd={(_, info) => {
                        const newStart = clip.startTime + (info.offset.x / zoom);
                        updateClip(track.id, clip.id, { startTime: Math.max(0, newStart) });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingClip({ trackId: track.id, clipId: clip.id });
                      }}
                      className={`absolute top-2 bottom-2 rounded-lg border glass ${getTrackColor(track.type)} ${editingClip?.clipId === clip.id ? 'ring-2 ring-studio-primary border-transparent' : ''} flex flex-col justify-center px-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] transition-all duration-200 z-10 shadow-2xl overflow-hidden group/clip`}
                      style={{ 
                        left: `${clip.startTime * zoom}px`, 
                        width: `${clip.duration * zoom}px` 
                      }}
                    >
                      {/* Trim Handles */}
                      <motion.div 
                        drag="x"
                        dragMomentum={false}
                        dragConstraints={{ left: -clip.startTime * zoom, right: (clip.duration - 0.5) * zoom }}
                        onDrag={(_, info) => {
                          const delta = info.delta.x / zoom;
                          updateClip(track.id, clip.id, { 
                            startTime: clip.startTime + delta,
                            duration: clip.duration - delta,
                            offset: (clip.offset || 0) + delta
                          });
                        }}
                        className="absolute left-0 top-0 bottom-0 w-2 hover:bg-white/40 cursor-ew-resize z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity"
                      />
                      <motion.div 
                        drag="x"
                        dragMomentum={false}
                        dragConstraints={{ left: (0.5 - clip.duration) * zoom, right: 1000 }}
                        onDrag={(_, info) => {
                          const delta = info.delta.x / zoom;
                          updateClip(track.id, clip.id, { 
                            duration: clip.duration + delta
                          });
                        }}
                        className="absolute right-0 top-0 bottom-0 w-2 hover:bg-white/40 cursor-ew-resize z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity"
                      />

                      <div className="flex items-center justify-between mb-1 relative z-10">
                        <div className="flex items-center gap-1 min-w-0">
                          {(clip.volume || 0) !== 0 && <Volume2 size={8} className="flex-shrink-0" />}
                          <span className="text-[10px] font-bold truncate tracking-tight">{clip.name}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeClip(track.id, clip.id);
                          }}
                          className="p-1 hover:bg-black/20 rounded-full text-white/40 hover:text-white transition-colors opacity-0 group-hover/clip:opacity-100"
                        >
                          <Plus size={10} className="rotate-45" />
                        </button>
                      </div>
                      <div className="h-6 w-full bg-black/20 rounded-md overflow-hidden relative">
                         <div className="flex items-center h-full gap-[1px] px-1">
                            {Array.from({ length: Math.floor(clip.duration * 2) }).map((_, i) => {
                              const h = 30 + Math.random() * 70;
                              const scaledH = h * (1 + (clip.volume || 0) / 40);
                              return <div key={i} className="bg-white/40 w-[2px] rounded-full" style={{ height: `${scaledH}%` }} />;
                            })}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-white z-30 pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              style={{ left: `${currentTime * zoom}px` }}
            >
              <div className="w-3 h-3 bg-white absolute -top-1 -left-[5px] rounded-full" />
              <div className="w-3 h-3 bg-white absolute -bottom-1 -left-[5px] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
