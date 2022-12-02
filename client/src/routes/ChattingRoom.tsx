import GroupSelectSidebar from "../components/Sidebar/GroupSelectSidebar";
import Header from "../components/Header/Header";
import SingleGroupSidebar from "../components/Sidebar/SingleGroupSidebar";

import { io } from "socket.io-client";
const socket = io();


function ChattingRoom() {

  socket.emit("createRoom", /*selectedID*/);

  socket.on("roomNameSend", (roomName) => {
    const nickname: any = window.localStorage.getItem("nickname");
    socket.emit("joinRoom", roomName, nickname);
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
