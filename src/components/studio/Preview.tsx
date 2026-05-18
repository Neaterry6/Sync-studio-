import { useRef, useEffect, useState } from "react";
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Share2, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PreviewProps {
  type: "audio" | "video" | "photo" | "design";
}

export function Preview({ type }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation of content based on type
  return (
    <div id="preview-window" className="w-full h-full flex flex-col items-center justify-center relative bg-studio-bg rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      {/* Viewport Meta Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button className="p-2.5 bg-studio-surface/80 backdrop-blur-md rounded-xl text-slate-500 hover:text-white transition-all border border-white/5 shadow-xl hover:scale-105 active:scale-95">
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2.5 bg-studio-surface/80 backdrop-blur-xl rounded-full text-slate-500 border border-white/5 z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <button className="hover:text-white transition-colors"><ZoomOut size={18} /></button>
        <span className="text-xs font-mono font-bold w-12 text-center text-studio-primary tracking-tighter">100%</span>
        <button className="hover:text-white transition-colors"><ZoomIn size={18} /></button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="hover:text-white transition-colors"><RotateCcw size={16} /></button>
      </div>

      {/* Main Preview Screen */}
      <AnimatePresence mode="wait">
        <motion.div
           key={type}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 1.05 }}
           className="w-full h-full flex items-center justify-center p-12 relative"
        >
          {type === 'audio' && (
            <div className="w-full max-w-2xl h-64 flex items-center justify-center gap-1.5 overflow-hidden">
               {/* Linear visualizer simulation with studio-audio color */}
               {Array.from({ length: 96 }).map((_, i) => (
                 <motion.div 
                   key={i}
                   className="w-1 bg-gradient-to-t from-studio-audio/20 via-studio-audio to-studio-audio/40 rounded-full shadow-[0_0_10px_rgba(0,217,255,0.2)]"
                   animate={{ height: [`${20 + Math.random() * 80}%`, `${10 + Math.random() * 90}%`] }}
                   transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.4, ease: "easeInOut" }}
                 />
               ))}
            </div>
          )}

          {type === 'video' && (
            <div className="w-full max-w-4xl aspect-video bg-[#020305] rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-studio-video/5 to-transparent pointer-events-none" />
              <div className="text-slate-800 flex flex-col items-center">
                 <div className="w-16 h-16 rounded-3xl border-2 border-white/5 flex items-center justify-center mb-6 shadow-inner">
                    <div className="w-6 h-6 bg-studio-video/20 rounded-md" />
                 </div>
                 <span className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30">Studio One Video Engine</span>
              </div>
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-studio-video/40 font-bold uppercase tracking-widest">
                 Live Feed
              </div>
            </div>
          )}

          {type === 'photo' || type === 'design' ? (
            <div className="w-full max-w-2xl aspect-square bg-studio-surface border border-white/5 rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] flex items-center justify-center relative overflow-hidden">
               {/* Pattern for transparency */}
               <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
               
               {type === 'design' && (
                 <motion.div 
                   className="w-48 h-48 md:w-64 md:h-64 border-2 border-studio-design flex items-center justify-center relative glass"
                   drag
                   dragConstraints={{ 
                     left: window.innerWidth < 768 ? -100 : -300, 
                     right: window.innerWidth < 768 ? 100 : 300, 
                     top: window.innerWidth < 768 ? -100 : -300, 
                     bottom: window.innerWidth < 768 ? 100 : 300 
                   }}
                 >
                   <div className="w-2.5 h-2.5 bg-white absolute -top-1.5 -left-1.5 rounded-sm shadow-lg" />
                   <div className="w-2.5 h-2.5 bg-white absolute -top-1.5 -right-1.5 rounded-sm shadow-lg" />
                   <div className="w-2.5 h-2.5 bg-white absolute -bottom-1.5 -left-1.5 rounded-sm shadow-lg" />
                   <div className="w-2.5 h-2.5 bg-white absolute -bottom-1.5 -right-1.5 rounded-sm shadow-lg" />
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] md:text-[10px] text-studio-design font-black uppercase tracking-widest select-none">Vector Object</span>
                      <span className="text-[6px] md:text-[8px] text-slate-500 font-mono mt-1">256 x 256 px</span>
                   </div>
                 </motion.div>
               )}

               {type === 'photo' && (
                 <div className="px-12 text-center">
                    <span className="text-slate-800 text-[10px] uppercase font-black tracking-[0.5em]">Digital Canvas</span>
                 </div>
               )}
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
