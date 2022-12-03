import GroupSelectSidebar from "../components/Sidebar/GroupSelectSidebar";
import Header from "../components/Header/Header";
import SingleGroupSidebar from "../components/Sidebar/SingleGroupSidebar";

import { io } from "socket.io-client";
const socket = io();


function ChattingRoom() {

  socket.emit("createRoom", /*selectedID*/);

  socket.on("sendRoomName", (roomName) => {
    socket.emit("joinRoom", roomName);
  })

  

  return (
    <>
      <GroupSelectSidebar />
      <Header />
      <SingleGroupSidebar />
    </>
  );
}

export default ChattingRoom;
