

import { Server, Socket } from "socket.io";

// interface SocketUser {
//   userId: string;
//   socketId: string;
// }
const usersMap = new Map<string, string>(); // userId -> socketId

const addUser = (userId: string, socketId: string) => {
  usersMap.set(userId, socketId);
};

const removeUser = (socketId: string) => {
  for (const [userId, id] of usersMap.entries()) {
    if (id === socketId) {
      usersMap.delete(userId);
      break;
    }
  }
};

const getUser = (userId: string) => {
  const socketId = usersMap.get(userId);
  return socketId ? { userId, socketId } : null;
};

const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // when connect
    console.log("a user connected.");

    // take userId and socketId from user
    socket.on("addUser", (userId: string) => {
      addUser(userId, socket.id);
      io.emit("getUsers", usersMap);
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    });

    // when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", usersMap);
    });
  });
};

export default initializeSocket;
