

import { Server, Socket } from "socket.io";

interface SocketUser {
  userId: string;
  socketId: string;
}

let users: SocketUser[] = [];

const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // when connect
    console.log("a user connected.");

    // take userId and socketId from user
    socket.on("addUser", (userId: string) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
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
      io.emit("getUsers", users);
    });
  });
};

export default initializeSocket;
