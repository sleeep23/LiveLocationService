// app.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const port = 5100;

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}
interface ClientToServerEvents {
  hello: () => void;
}
interface InterServerEvents {
  ping: () => void;
}
interface SocketData {
  name: string;
  age: number;
}

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  })
);
app.get("/", (req, res) => {
  res.send({ test: "hi" });
});
app.get("/*", (req, res) => {
  res.redirect("/");
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms: string[] = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName: string) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}
wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", countRoom(roomName));
  });
  socket.on("leave_room", (roomName, done) => {});
});

app.listen(port);
console.log("Server listening on http://127.0.0.1:5100/");
