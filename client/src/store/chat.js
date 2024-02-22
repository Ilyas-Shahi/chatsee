import { create } from 'zustand';

export const useChatStore = create((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
}));
