import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

interface Clip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  offset: number;
  volume: number;
  name: string;
  type: 'audio' | 'video' | 'image' | 'text' | 'midi';
  sourceUrl?: string;
}

interface Track {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image' | 'text' | 'midi';
  muted: boolean;
  solo: boolean;
  armed: boolean;
  volume: number;
  clips: Clip[];
}

interface TimelineState {
  tracks: Track[];
  currentTime: number;
  zoom: number;
  isPlaying: boolean;
  
  addTrack: (type: Track['type']) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  addClip: (trackId: string, clip: Omit<Clip, 'id' | 'trackId'>) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<Clip>) => void;
  removeClip: (trackId: string, clipId: string) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
}

export const useTimelineStore = create<TimelineState>()(
  immer((set) => ({
    tracks: [
      { id: '1', name: 'Vocal Track', type: 'audio', muted: false, solo: false, armed: true, volume: 0, clips: [] },
      { id: '2', name: 'Main Beat', type: 'audio', muted: false, solo: false, armed: false, volume: 0, clips: [] },
      { id: '3', name: 'Video Layer 1', type: 'video', muted: false, solo: false, armed: false, volume: 0, clips: [] },
    ],
    currentTime: 0,
    zoom: 80,
    isPlaying: false,

    addTrack: (type) => set((state) => {
      state.tracks.push({
        id: uuidv4(),
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Track`,
        type,
        muted: false,
        solo: false,
        armed: false,
        volume: 0,
        clips: [],
      });
    }),

    removeTrack: (id) => set((state) => {
      state.tracks = state.tracks.filter(t => t.id !== id);
    }),

    updateTrack: (id, updates) => set((state) => {
      const track = state.tracks.find(t => t.id === id);
      if (track) Object.assign(track, updates);
    }),

    addClip: (trackId, clip) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) {
        track.clips.push({ 
          ...clip, 
          id: uuidv4(), 
          trackId,
          volume: clip.volume ?? 0,
          offset: clip.offset ?? 0 
        });
      }
    }),

    updateClip: (trackId, clipId, updates) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) {
        const clip = track.clips.find(c => c.id === clipId);
        if (clip) Object.assign(clip, updates);
      }
    }),

    removeClip: (trackId, clipId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) {
        track.clips = track.clips.filter(c => c.id !== clipId);
      }
    }),

    setCurrentTime: (time) => set((state) => {
      state.currentTime = time;
    }),

    setIsPlaying: (playing) => set((state) => {
      state.isPlaying = playing;
    }),

    setZoom: (zoom) => set((state) => {
      state.zoom = zoom;
    }),
  }))
);
