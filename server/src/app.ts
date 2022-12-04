// app.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { userLocations } from "./DB/userLocations.js";
import { LocationType } from "./types/userTypes";
import { ChatType } from "./types/chatTypes";
import { createClient } from "@supabase/supabase-js";
import { exit } from "process";

const options = {
  db: {
    schema: "public",
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
};

const app = express();
const port = 5100;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

const supabase = createClient(
  "https://mgzxxdgcudzhueouyorv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nenh4ZGdjdWR6aHVlb3V5b3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Njg0ODksImV4cCI6MTk4NDI0NDQ4OX0.kF02tvUzcZGTuWZj-QViobyi5pzcMMyhwAyGBU3j928",
  options
);

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
const AddUser = async (userID: string, userName: string) => {
  const { error } = await supabase
    .from("user")
    .insert({ user_id: userID, user_name: userName });
  if (error) console.log("Supabase DB insertion failed: ", error.message);
};
const RemoveUser = async (userID: string) => {
  // cascading problem -> solved by delete referenced tuples one by one
  const { error } = await supabase
    .from("chat_member")
    .delete()
    .match({ user_id: userID });
  await supabase.from("user_location").delete().match({ user_id: userID });
  await supabase.from("user").delete().match({ user_id: userID });
  if (error) console.log(error);
};
const GetUserInfo = async (userID: string) => {
  const { data, error } = await supabase
    .from("user")
    .select("user_name")
    .eq("user_id", userID);
  return data?.pop();
};
const AddUserLocation = async (userID: string, location: LocationType) => {
  const { error } = await supabase
    .from("user_location")
    .insert({ user_id: userID, lat: location.lat, lng: location.lng });
  if (error) console.log("Supabase DB insertion failed: ", error.message);
};
const updateUserLocation = async (userID: string, location: LocationType) => {
  // regular location update
  const { error } = await supabase
    .from("user_location")
    .update({ lat: location.lat, lng: location.lng })
    .eq("user_id", "userID");
};
const GetUserLocations = async () => {
  const { data, error } = await supabase.from("user_location").select();
  if (error) console.log("Supabase DB selection failed: ", error.message);
  else return data;
};

const addRoomInfo = async (roomID: string, roomName: string) => {
  const { error } = await supabase
    .from("chat_room")
    .insert({ room_id: roomID, room_name: roomName });
  if (error) console.log("Supabase DB insertion failed: ", error.message);
};

const addRoomMember = async (userIDs: any, roomID: string) => {
  for (const id of userIDs) {
    const { error } = await supabase
      .from("chat_member")
      .insert({ user_id: id, room_id: roomID });
    if (error) {
      console.log(error);
      exit(1);
    }
  }
};

const deleteRoomData = async (userID: string, roomID: string) => {
  const { error } = await supabase
    .from("chat_member")
    .delete()
    .match({ user_id: userID, room_id: roomID });
  // await supabase.from('chat_message').delete().match({user_id: userID, room_id: roomID});
  // 유저가 방에서 나갔을 때, 그 유저의 채팅 히스토리도 모두 지워야 할까?
};

const GetChatMessage = async (roomId: any) => {
  const { data, error } = await supabase
    .from("chat_message")
    .select("*")
    .eq("room_id", roomId);
  if (!error) return data;
};

// ------------------- Supabase test code -------------------------
const getTable = async () => {
  const { data, error } = await supabase
    .from("user")
    .select("user_name")
    .in("user_id", ["asdfghkl", "12345", "23456"]);
  let roomName = ``;
  data?.forEach((names) => {
    roomName = roomName + `${names.user_name}, `;
  });
  console.log(roomName);
};
getTable();

const deleteTable = async () => {
  const { error } = await supabase
    .from("chat_member")
    .delete()
    .match({ user_id: "asdfghkl" });
  await supabase.from("user_location").delete().match({ user_id: "asdfghkl" });
  await supabase.from("user").delete().match({ user_id: "asdfghkl" });
  if (error) console.log(error);
};

deleteTable();
// --------------------------------------------------------------

// Socket connection
io.on("connection", (socket) => {
  socket.on("send_user_nickname", (nickname: string) => {
    cntUser = nickname;
  });
  socket.on("addUser", (user) => {
    AddUser(socket.id, user.nickname);
  });
  socket.on("addUserLocation", (user) => {
    AddUserLocation(socket.id, user.location);
  });
  socket.on("get_location", () => {
    socket.emit("send_locations", GetUserLocations(), () => {
      console.log("Here are the user locations");
    });
  });
  socket.on("update_location", (user) => {
    // receive regular update calls
    updateUserLocation(socket.id, user.location);
  });

  // receive socket id of a clicked client
  socket.on("createRoom", async (IDs: any) => {
    // IDs : array of participant's IDs;
    const { data, error } = await supabase
      .from("user")
      .select("user_name")
      .in("user_id", IDs);
    // let hostName = Object.keys(users).find(key => users.get(key) === socket.id)
    // const nickName = GetUserInfo(curID)
    let roomName = ``;
    data?.forEach((names) => {
      roomName = roomName + `${names.user_name}, `;
    });
    socket.join(roomName);
    // room id == socket id of room creater
    addRoomInfo(socket.id, roomName); // insert room id and room name into 'chat_room' DB
    addRoomMember(IDs, socket.id); // insert user id and room id into 'chat_member' DB
    socket.broadcast.to(roomName).emit("sendRoomName");
  });
  // route to ChattingRoom after "createRoom"

  socket.on("joinRoom", (roomName) => {
    // allow the invited client to participate
    socket.join(roomName);
    //socket.to(roomName).emit("welcomeMessage", nickname);
  });

  socket.on("get_rooms", async (user_id) => {
    let roomIDs: Array<any> = [];
    const { data, error } = await supabase
      .from("chat_member")
      .select("room_id")
      .eq("user_id", user_id);
    data?.forEach((item) => {
      roomIDs.push(item.room_id);
    });
    if (!error) {
      socket.emit("send_rooms", roomIDs);
    }

    // output format example: [roomID1, roomID2]
  });

  socket.on("get_chat_messages", async (room_id) => {
    const data = GetChatMessage(room_id);
    socket.emit("send_chat_messages", data);

    // output format example: [{user_id: userID, room_id: roomID, message: Message, time: current_time}, ...]
  });

  socket.on("update_chat_messages", async (record) => {
    const { error } = await supabase.from("chat_message").insert({
      user_id: record.socketID,
      room_id: record.roomID,
      message: record.message,
      tiem: record.time,
    });
    if (!error) {
      const data = GetChatMessage(record.roomID);
      socket.emit("send_updated_chat_messages", data);
    }

    // output format example: [{user_id: userID, room_id: roomID, message: Message, time: current_time}, ...]
  });

  socket.on("leaveRoom", async (userID: string, roomID: string) => {
    const { data, error } = await supabase
      .from("chat_room")
      .select("room_name")
      .eq("room_id", roomID);
    const roomName: any = data?.forEach((item) => item.room_name);
    const userName: any = GetUserInfo(userID);
    deleteRoomData(userID, roomID);
    socket.leave(roomName);
    socket
      .in(roomName)
      .emit("leaveRoomMessage", `${userName.user_name} has left from the room`);
    // send the message that someone leaves the room to everyone in the room
  });

  socket.on("disconnect", () => {
    RemoveUser(socket.id);
    // socket.emit("get_user_nickname");
  });
});

httpServer.listen(port, () => {
  console.log("Server is running on port " + port);
});
