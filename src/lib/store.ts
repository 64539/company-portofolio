import { create } from 'zustand';

interface AppState {
  isSyncing: boolean;
  nervePulse: number; // Timestamp to trigger pulse animation
  triggerSync: () => void;
}

export const useStore = create<AppState>((set) => ({
  isSyncing: false,
  nervePulse: 0,
  triggerSync: () => {
    set({ isSyncing: true });
    
    setTimeout(() => {
      set((state) => ({ isSyncing: false, nervePulse: Date.now() }));
      
      const collectiveSection = document.getElementById('collective');
      if (collectiveSection) {
        collectiveSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
  },
}));
