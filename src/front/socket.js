import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_SOCKET, {
  autoConnect: false
});

export default socket;