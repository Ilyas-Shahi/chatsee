import { io } from 'socket.io-client';

const uri = import.meta.env.SERVER_ORIGIN || 'http://localhost:3000';

export const socket = io(uri, {
  autoConnect: false,
  withCredentials: true,
});
