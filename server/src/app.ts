// app.js
import { KeyObject } from "crypto";
import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { userLocations } from "./DB/userLocations.js";
import { LocationType } from "./types/userTypes";
import { ChatType } from "./types/chatTypes";

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
export let roomInfo: Map<string, string> = new Map(); // Room Map storing room name and room id(host's socket id)
export let chattings: Array<ChatType> = []; // chatting format 

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

const addRoomInfo = (roomName: string, roomID: string) => {
  roomInfo.set(roomName, roomID);
}


const GetUserInfo = (curID: string) => {
  let res: Map<string, string> = new Map();
  users.forEach((name, id) => {
    if (id == curID) {
      res.set(id, name);
      return res;
    }
  })
}

// const countRoom = (roomName: string) => {
//   return io.sockets.adapter.rooms.get(roomName)?.size;
// }

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
    socket.emit("sendUserLocations", GetUserLocations(), () => {
      console.log("Here are the user locations");
    });
  });

  socket.on("createRoom", (curID: string) => { // receive socket id of a clicked client
    let hostName = Object.keys(users).find(key => users.get(key) === socket.id)
    const nickName = GetUserInfo(curID)
    let roomName = `${hostName}, ${nickName}`;
    // if room name is given by the user, receive the room name through socket
    socket.join(roomName);
    addRoomInfo(roomName, socket.id)
    socket.to(curID).emit("roomNameSend", roomName);
  });
  // route to ChattingRoom after "createRoom"

  socket.on("joinRoom", (roomName) => { // allow the invited client to participate
    socket.join(roomName);
    //socket.to(roomName).emit("welcomeMessage", nickname); 
  })

  socket.on("sendMessage", (data) => { 
    socket.to(data.room).emit("receive_message", data);
  })

  socket.on("leaveRoom", (data) => {
    roomInfo.delete(data.author);
    socket.leave(data.room);
    socket.in(data.room).emit("leaveRoom");
  })
  
  socket.on("disconnect", () => {
    socket.emit("get_user_nickname");
    DeleteUserLocation(cntUser);
  });
});

httpServer.listen(port, () => {
  console.log("Server is running on port " + port);
});
