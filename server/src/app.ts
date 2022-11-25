// app.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const port = 5100;
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
console.log("Server listening on http://127.0.0.1:5100/");
