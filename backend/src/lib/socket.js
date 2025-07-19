import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
     
  }
});

const socketUser = {};

function getReceiverSocketId(userId) {
  return socketUser[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    socketUser[userId] = socket.id;
  }

  io.emit("getOnlineUser", Object.keys(socketUser));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete socketUser[userId];
    io.emit("getOnlineUser", Object.keys(socketUser));
  });
});

export {
  io,
  app,
  server,
  getReceiverSocketId
}