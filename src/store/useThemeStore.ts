import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StudioTheme = 'purple' | 'cyan' | 'orange' | 'pink' | 'mono';

interface ThemeState {
  theme: StudioTheme;
  setTheme: (theme: StudioTheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'purple',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'studio-theme-storage',
    }
  )
);
