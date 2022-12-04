import { useState } from "react";
import GroupSelectSidebar from "../components/Sidebar/GroupSelectSidebar";
import Header from "../components/Header/Header";
import SingleGroupSidebar from "../components/Sidebar/SingleGroupSidebar";
import Chatting from "../components/Chat/Chatting";

function ChattingRoom() {
  const [cntRoomId, setCntRoomId] = useState("");
  return (
    <>
      <GroupSelectSidebar setGroup={setCntRoomId} />
      <Header />
      <SingleGroupSidebar />
      <Chatting cntRoomId={cntRoomId} />
    </>
  );
}

export default ChattingRoom;
