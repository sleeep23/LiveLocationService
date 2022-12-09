// app.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { userLocations } from "./DB/userLocations.js";
import { LocationType } from "./types/userTypes";
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

// Adding user and their locations
const AddUser = async (userName: string) => {
  const { error } = await supabase.from("user").insert({ user_name: userName });
  if (error) {
    console.log("Supabase DB insertion failed at adding user: ", error.message);
    return error;
  }
};
const RemoveUser = async (userName: string) => {
  // cascading problem -> solved by delete referenced tuples one by one
  const { error } = await supabase
    .from("chat_member")
    .delete()
    .match({ user_name: userName });
  await supabase.from("user_location").delete().match({ user_name: userName });
  await supabase.from("user").delete().match({ user_name: userName });
  if (error) console.log(error);
};
const GetUserInfo = async () => {
  const { data, error } = await supabase.from("user").select("user_name");
  if (error) console.log(error);
  return data;
};

const AddUserLocation = async (userName: string, location: LocationType) => {
  const { error } = await supabase
    .from("user_location")
    .insert({ user_name: userName, lat: location.lat, lng: location.lng });
  if (error)
    console.log(
      "Supabase DB insertion failed at adding user location: ",
      error.message
    );
};
const updateUserLocation = async (userName: string, location: LocationType) => {
  // regular location update
  const { error } = await supabase
    .from("user_location")
    .update({ lat: location.lat, lng: location.lng })
    .eq("user_name", userName);
};
const GetUserLocations = async () => {
  const { data, error } = await supabase.from("user_location").select("*");

  if (error)
    console.log(
      "Supabase DB selection failed at getting user locations: ",
      error.message
    );
  else return data;
};

const addRoomInfo = async (roomName: string) => {
  const { error } = await supabase
    .from("chat_room")
    .insert({ room_name: roomName });
  if (error)
    console.log("Supabase DB insertion failed at adding room info: ", error);
};

const addRoomMember = async (name: any, roomName: string) => {
  const { error } = await supabase
    .from("chat_member")
    .insert({ user_name: name, room_name: roomName });
  if (error) {
    console.log(error);
  }
};

const getUserNameFromIndices = async (indices: Array<number>) => {
  const { data, error } = await supabase
    .from("user_location")
    .select("user_name");
  if (!error) {
    let names: Array<string> = [];
    let res: Array<string> = [];
    data.forEach((name: any) => {
      names.push(name.user_name);
    });
    for (const num of indices) {
      res.push(names[num]);
    }
    return res;
  } else {
    console.log("Supabase selection error", error);
  }
};

const getRoomNameByMember = async (username: string) => {
  const { data, error } = await supabase
    .from("chat_member")
    .select("room_name")
    .eq("user_name", username);

  if (error) console.log("Supabase DB selection failed: ", error);
  return data;
};

const deleteRoomData = async (userID: string, roomID: string) => {
  const { error } = await supabase
    .from("chat_member")
    .delete()
    .match({ user_id: userID, room_id: roomID });
  // await supabase.from('chat_message').delete().match({user_id: userID, room_id: roomID});
  // 유저가 방에서 나갔을 때, 그 유저의 채팅 히스토리도 모두 지워야 할까?
};

const getChatMessage = async (roomId: any) => {
  const { data, error } = await supabase
    .from("chat_message")
    .select("*")
    .eq("room_id", roomId);
  if (!error) return data;
};

// Socket connection
io.on("connection", (socket) => {
  socket.on("addUser", (user) => {
    if (user) {
      AddUser(user.nickname);
    }
  });
  socket.on("addUserLocation", async (user) => {
    AddUserLocation(user.nickname, user.location);
  });
  socket.on("get_location", async () => {
    const data = await GetUserLocations();
    socket.emit("send_locations", data, () => {
      console.log("Here are the user locations");
    });
  });
  socket.on("get_user_list", async () => {
    const data = await GetUserInfo();
    socket.emit("send_user_list", data);
  });
  socket.on("update_location", async (user) => {
    // receive regular update calls
    await updateUserLocation(user.nickname, user.location);
  });

  // receive socket id of a clicked client
  socket.on(
    "createRoom",
    async ({
      user_name,
      idx_arr,
    }: {
      user_name: string;
      idx_arr: Array<number>;
    }) => {
      // IDs : array of participant's IDs;
      let names: Array<string> | undefined = [];
      names = await getUserNameFromIndices(idx_arr);
      if (names) {
        names.push(user_name);
        let roomName = names.join(" , ");
        socket.join(roomName);
        addRoomInfo(roomName); // insert room name into 'chat_room' DB
        for (const name of names) {
          await addRoomMember(name, roomName); // insert user_name and room_name into 'chat_member' DB
        }
      }
    }
  );
  // route to ChattingRoom after "createRoom"

  socket.on("joinRoom", (roomName) => {
    // allow the invited client to participate
    socket.join(roomName);
    //socket.to(roomName).emit("welcomeMessage", nickname);
  });

  socket.on("get_rooms", async (userName) => {
    let roomNames: Array<string> = [];
    const data = await getRoomNameByMember(userName);
    data?.forEach((room) => {
      roomNames.push(room.room_name);
    });
    socket.emit("send_rooms", roomNames);
    // output format example: [roomID1, roomID2]
  });

  socket.on("get_chat_messages", async (room_id) => {
    const data = getChatMessage(room_id);
    socket.emit("send_chat_messages", data);

    // output format example: [{user_id: userID, room_id: roomID, message: Message, time: current_time}, ...]
  });

  socket.on("update_chat_messages", async (record) => {
    const { error } = await supabase.from("chat_message").insert({
      user_id: record.socketID,
      room_id: record.roomID,
      message: record.message,
      time: record.time,
    });
    if (!error) {
      const data = getChatMessage(record.roomID);
      socket.emit("send_updated_chat_messages", data);
    }

    // output format example: [{user_id: userID, room_id: roomID, message: Message, time: current_time}, ...]
  });

  // socket.on("leaveRoom", async (userID: string, roomID: string) => {
  //   const { data, error } = await supabase
  //     .from("chat_room")
  //     .select("room_name")
  //     .eq("room_id", roomID);
  //   const roomName: any = data?.forEach((item) => item.room_name);
  //   const userName: any = GetUserInfo();
  //   deleteRoomData(userID, roomID);
  //   socket.leave(roomName);
  //   socket
  //     .in(roomName)
  //     .emit("leaveRoomMessage", `${userName.user_name} has left from the room`);
  //   // send the message that someone leaves the room to everyone in the room
  // });

  socket.on("disconnect", () => {
    // RemoveUser(socket.id);
    // socket.emit("get_user_nickname");
  });
});

httpServer.listen(port, () => {
  console.log("Server is running on port " + port);
});
