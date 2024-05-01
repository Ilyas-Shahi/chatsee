import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  friendsData: [],
  setFriendsData: (friendsData) => set({ friendsData }),

  authModal: { for: 'login', show: false },
  setAuthModal: (authModal) => set({ authModal }),

  showAddFriend: false,
  setShowAddFriend: (showAddFriend) => set({ showAddFriend }),
}));
