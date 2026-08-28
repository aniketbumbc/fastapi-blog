import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  hasHydrated: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

function applyMode(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

// Shared across tabs (unlike auth's per-tab sessionStorage) since theme is a
// device-level preference, not a session.
const localStorageAdapter = createJSONStorage<Pick<ThemeState, 'mode'>>(() =>
  typeof window === 'undefined'
    ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
    : window.localStorage,
);

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      hasHydrated: false,
      setMode: (mode) => {
        applyMode(mode);
        set({ mode });
      },
      toggle: () => get().setMode(get().mode === 'dark' ? 'light' : 'dark'),
    }),
    {
      name: 'theme-storage',
      storage: localStorageAdapter,
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyMode(state.mode);
          state.hasHydrated = true;
        }
      },
    },
  ),
);
