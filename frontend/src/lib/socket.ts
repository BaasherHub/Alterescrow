import { io } from "socket.io-client";

export function createSocket(token?: string) {
  const url = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";
  return io(url, {
    transports: ["websocket"],
    auth: token ? { token } : undefined,
  });
}
