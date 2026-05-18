import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Trophy } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

const INITIAL_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'studio-app',
    title: 'Welcome to Studio One',
    content: 'The all-in-one professional studio. Let\'s set up your first project.',
    position: 'center'
  },
  {
    targetId: 'toolbar-import',
    title: '1. Import Your Beat',
    content: 'Start by uploading your beat from your device or cloud. We support WAV, MP3, and more.',
    position: 'bottom'
  },
  {
    targetId: 'transport-record',
    title: '2. Record Vocals',
    content: 'Arm your track and hit the big red button to record. We handle latency automatically for perfect sync.',
    position: 'top'
  },
  {
    targetId: 'timeline-area',
    title: '3. Multi-Track Timeline',
    content: 'Your vocals and beats sit on separate tracks. Drag to move, or trim handles to edit.',
    position: 'top'
  }
];

const SECOND_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'transport-record',
    title: 'Pro Tip: Layering',
    content: 'You can record multiple vocal layers by arming different tracks. Try recording a backup track now!',
    position: 'top'
  },
  {
    targetId: 'timeline-area',
    title: 'Clip Editing',
    content: 'Click any clip on the timeline to adjust its gain (dB) or rename it for better organization.',
    position: 'top'
  }
];

const THIRD_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'sidebar-nav',
    title: 'Advanced Mixing',
    content: 'Open the Mixer to access the FX Rack. Use Voice Cleaner to remove noise instantly.',
    position: 'right'
  },
  {
    targetId: 'sidebar-nav',
    title: 'Auto Pitch',
    content: 'Apply professional Auto-Pitch (Auto-Tune) to any vocal track with one click.',
    position: 'right'
  }
];

export function GuidedTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  
  const visits = parseInt(localStorage.getItem('studio_one_visits') || '1');
  const tourSteps = visits === 1 ? INITIAL_TOUR_STEPS : visits === 2 ? SECOND_TOUR_STEPS : THIRD_TOUR_STEPS;

  useEffect(() => {
    const step = tourSteps[currentStep];
    if (!step) return;
    const element = document.getElementById(step.targetId);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, tourSteps]);

  const next = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const step = tourSteps[currentStep];
  if (!step) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark Overlay with Hole */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all duration-500" style={{
        clipPath: step.position === 'center' 
          ? 'none' 
          : `polygon(0% 0%, 0% 100%, ${coords.left}px 100%, ${coords.left}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top + coords.height}px, ${coords.left}px ${coords.top + coords.height}px, ${coords.left}px 100%, 100% 100%, 100% 0%)`
      }} />

      {/* Dynamic Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="absolute z-[110] pointer-events-auto"
          style={
            step.position === 'center' ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } :
            step.position === 'bottom' ? { top: coords.top + coords.height + 20, left: coords.left + (coords.width / 2) - 150 } :
            step.position === 'top' ? { top: coords.top - 200, left: coords.left + (coords.width / 2) - 150 } :
            step.position === 'right' ? { top: coords.top + (coords.height / 2) - 100, left: coords.left + coords.width + 20 } :
            { top: coords.top + (coords.height / 2) - 100, left: coords.left - 320 }
          }
        >
          <div className="w-[300px] bg-studio-surface border border-studio-primary/30 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] glass">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-studio-primary bg-studio-primary/10 px-2 py-1 rounded">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <button onClick={onComplete} className="text-slate-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold mb-2 tracking-tight">{step.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {step.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tourSteps.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === currentStep ? 'w-4 bg-studio-primary' : 'w-1 bg-white/10'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button onClick={prev} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <button 
                  onClick={next}
                  className="bg-studio-primary text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-studio-primary-hover shadow-lg shadow-studio-primary/20"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            {/* Arrow Pointer */}
            {step.position !== 'center' && (
              <div className={`absolute w-4 h-4 bg-studio-surface border-l border-t border-studio-primary/30 rotate-45 ${
                step.position === 'bottom' ? '-top-2 left-1/2 -translate-x-1/2' :
                step.position === 'top' ? '-bottom-2 left-1/2 -translate-x-1/2 border-l-0 border-t-0 border-r border-b' :
                step.position === 'right' ? '-left-2 top-1/2 -translate-y-1/2' :
                '-right-2 top-1/2 -translate-y-1/2 border-l-0 border-t-0 border-r border-b'
              }`} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
