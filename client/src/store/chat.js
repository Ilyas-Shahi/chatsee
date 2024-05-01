import { create } from 'zustand';

export const useChatStore = create((set) => ({
  room: null,
  setRoom: (room) => set({ room }),

  loading: true,
  setLoading: (loading) => set({ loading }),

  messages: [],
  setMessages: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessagesFromDB: (messages) => set({ messages }),

  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

  errorModal: { type: '', message: '', show: false },
  setErrorModal: (errorModal) => set({ errorModal }),
}));
