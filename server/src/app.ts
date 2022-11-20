// app.js
import path from 'path';
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const __dirname = path.resolve();

const app = express();
const port = 5100;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);

app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, '/src/views/index.html'))
});

app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);

interface ServerToClientEvents {
  bye: (id: any) => void;
  addNick: (name: any, id: any) => void;
}

interface ClientToServerEvents {
  nickname: (name: any, done: any) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  nickname: string;
}

const wsServer = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

const usrInfo = new Map();

wsServer.on("connection", (socket) => {
  socket.on("nickname", (name, done) => {
    usrInfo.set(socket.id, name);
    socket.broadcast.emit("addNick", name, socket.id);
    done();
    usrInfo.forEach((name, id) => {
      if (id !== socket.id) {
        socket.emit("addNick", name, id);
      }
    });
  })
  socket.on("disconnect", () => {
    usrInfo.delete(socket.id);
    wsServer.sockets.emit("bye", socket.id);
  })

})

httpServer.listen(port);
console.log("Server listening on http://127.0.0.1:5100/");
