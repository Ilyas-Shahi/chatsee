import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  friendsData: [],
  setFriendsData: (friendsData) => set({ friendsData }),

  showModal: { for: 'login', show: false },
  setShowModal: (showModal) => set({ showModal }),
}));
