import { Volume2, VolumeX, SlidersHorizontal, Activity, Zap, Waves } from "lucide-react";
import { useTimelineStore } from "../../store/useTimelineStore";

export function Mixer() {
  const { tracks, updateTrack } = useTimelineStore();

  return (
    <div className="h-full flex px-2 md:px-4 pt-4 pb-2 gap-2 overflow-x-auto custom-scrollbar bg-studio-bg relative z-10">
      {tracks.map((track) => (
        <div 
          key={track.id} 
          className="flex flex-col w-16 md:w-20 flex-shrink-0"
        >
          {/* Level Meter */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-lg flex items-end justify-center p-1 gap-0.5 relative overflow-hidden group">
            <div className={`absolute top-0 bottom-0 left-0 right-0 opacity-10 bg-gradient-to-t from-transparent via-studio-audio to-studio-audio`} />
            <div 
              className={`w-full transition-all duration-75 rounded-t-sm bg-studio-audio/80`} 
              style={{ height: `${Math.max(0, 100 + (track.volume * 2))}%` }}
            />
            {/* Markers */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
              {[0, -6, -12, -18, -24, -36, -48].map(db => (
                <div key={db} className="border-t border-slate-500 w-full flex justify-end pr-1">
                  <span className="text-[6px] font-mono font-bold">{db}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex gap-1">
              <button 
                onClick={() => updateTrack(track.id, { solo: !track.solo })}
                className={`flex-1 text-[8px] md:text-[9px] font-bold py-1.5 rounded-md transition-all ${track.solo ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-studio-surface text-slate-500 hover:text-slate-300'}`}
              >
                S
              </button>
              <button 
                onClick={() => updateTrack(track.id, { muted: !track.muted })}
                className={`flex-1 text-[8px] md:text-[9px] font-bold py-1.5 rounded-md transition-all ${track.muted ? 'bg-danger text-white shadow-lg shadow-danger/20' : 'bg-studio-surface text-slate-500 hover:text-slate-300'}`}
              >
                M
              </button>
            </div>
            
            <div className="relative group/fader h-20 md:h-24 flex justify-center">
               <div className="absolute inset-y-0 w-1 bg-black/40 rounded-full" />
               <input 
                 type="range" 
                 orient="vertical"
                 className="absolute inset-y-0 w-4 opacity-0 cursor-ns-resize z-10"
                 min="-60"
                 max="6"
                 value={track.volume}
                 onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
               />
               {/* Fader Handle Simulation */}
               <div className="absolute w-5 md:w-6 h-2 bg-slate-400 rounded-sm border border-white/20 shadow-xl z-0" style={{ top: `${(6 - track.volume) / 66 * 100}%` }} />
            </div>

            <div className="text-center truncate">
              <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-tighter ${track.type === 'video' ? 'text-studio-video' : 'text-studio-audio'}`}>
                {track.name}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Master Channel (Simulated for now) */}
      <div className="flex flex-col w-16 md:w-20 flex-shrink-0 ml-auto border-l border-white/5 pl-4">
          <div className="flex-1 bg-black/40 border border-white/5 rounded-lg flex items-end justify-center p-1 gap-0.5 relative overflow-hidden group">
            <div className="absolute top-0 bottom-0 left-0 right-0 opacity-10 bg-gradient-to-t from-transparent via-studio-primary to-studio-primary" />
            <div className="w-full h-[60%] bg-studio-primary/80 transition-all rounded-t-sm" />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="h-[26px]" />
            <div className="relative group/fader h-20 md:h-24 flex justify-center">
               <div className="absolute inset-y-0 w-1 bg-black/40 rounded-full" />
               <div className="absolute w-5 md:w-6 h-2 bg-studio-primary rounded-sm border border-white/20 shadow-xl z-0 top-[40%]" />
            </div>
            <div className="text-center truncate">
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-tighter text-studio-primary">MASTER</span>
            </div>
          </div>
      </div>

      {/* FX Rack */}
      <div className="hidden lg:flex w-72 ml-4 border-l border-white/5 pl-4 flex-col gap-3 overflow-y-auto custom-scrollbar">
         <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">Inserts & AI Tools</span>
         
         {/* Voice Cleaner Module (AI) */}
         <div className="bg-studio-audio/10 border border-studio-audio/20 rounded-xl p-3 space-y-3 group hover:bg-studio-audio/20 transition-all">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-studio-audio" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Voice Cleaner</span>
               </div>
               <button className="text-[8px] bg-studio-audio text-white px-2 py-0.5 rounded-full font-bold">AI</button>
            </div>
            <p className="text-[8px] text-slate-500 leading-tight">Remove background noise and room reverb automatically using RNNoise.</p>
            <div className="flex items-center gap-2">
               <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-studio-audio w-3/4" />
               </div>
               <span className="text-[8px] font-mono text-slate-500">75%</span>
            </div>
         </div>
         
         {/* Pitch Correction Module (TuneMe/Voloco Style) */}
         <div className="bg-studio-primary/10 border border-studio-primary/20 rounded-xl p-3 space-y-3 group hover:bg-studio-primary/20 transition-all">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Zap size={14} className="text-studio-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Auto Pitch</span>
               </div>
               <div className="w-8 h-4 bg-studio-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] uppercase text-slate-600 font-bold">Strength</span>
                  <div className="h-10 bg-black/40 rounded-lg flex flex-col items-center justify-center relative group/knob">
                     <Waves size={16} className="text-studio-primary/40 group-hover/knob:text-studio-primary transition-colors" />
                     <div className="text-[8px] font-mono mt-0.5 text-studio-primary">Hard</div>
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] uppercase text-slate-600 font-bold">Key</span>
                  <div className="h-10 bg-black/40 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-300">
                     C Minor
                  </div>
               </div>
            </div>
         </div>

         {['Compressor', 'Vocal EQ', 'De-Esser', 'Plate Reverb'].map(fx => (
            <div key={fx} className="bg-studio-surface/40 border border-white/5 p-2.5 rounded-xl flex items-center justify-between group hover:bg-studio-surface/60 hover:border-white/10 transition-all active:scale-[0.98]">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200">{fx}</span>
              <SlidersHorizontal size={12} className="text-slate-600 group-hover:text-studio-primary transition-colors" />
            </div>
         ))}
      </div>
    </div>
  );
}
