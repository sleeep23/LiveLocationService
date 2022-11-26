// app.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { userLocations } from "./DB/userLocations.js";
import { LocationType } from "./types/userTypes";

const app = express();
const port = 5100;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

interface UserLocationType {
  nickname: string;
  location: LocationType;
}

// Fake DB with type Map
export let users: Map<string, string> = new Map();
export let userLocations: Map<string, LocationType> = new Map();
export let cntUser: string = "Default";

// Adding user and their locations
const AddUser = (nickname: string, socketID: string) => {
  users.set(nickname, socketID);
};
const RemoveUser = (nickname: string) => {
  users.delete(nickname);
};
const AddUserLocation = (nickname: string, location: LocationType) => {
  userLocations.set(nickname, location);
};
const DeleteUserLocation = (nickname: string) => {
  userLocations.delete(nickname);
};
const GetUserLocations = () => {
  let result: Array<UserLocationType> = [];
  userLocations.forEach((val, key) => {
    result.push({ nickname: key, location: val });
  });
  return result;
};

// Socket connection
io.on("connection", (socket) => {
  socket.on("send_user_nickname", (nickname: string) => {
    cntUser = nickname;
  });
  socket.on("addUser", (user) => {
    AddUser(user.nickname, socket.id);
  });
  socket.on("addUserLocation", (user) => {
    AddUserLocation(user.nickname, user.location);
  });
  socket.on("getUserLocations", () => {
    io.to(socket.id).emit("sendUserLocations", GetUserLocations(), () => {
      console.log("Here are the user locations");
    });
  });
  socket.on("disconnect", () => {
    io.to(socket.id).emit("get_user_nickname");
    DeleteUserLocation(cntUser);
  });
});

httpServer.listen(port, () => {
  console.log("Server is running on port " + port);
});
