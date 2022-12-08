import { useEffect, useState } from "react";
import GroupSelectSidebar from "../components/Sidebar/GroupSelectSidebar";
import Header from "../components/Header/Header";
import SingleGroupSidebar from "../components/Sidebar/SingleGroupSidebar";
import Chatting from "../components/Chat/Chatting";

function ChattingRoom({ username }: { username: string }) {
  const [cntRoomName, setCntRoomName] = useState("");
  const [cntRoomMembers, setCntRoomMembers] = useState<Array<string>>([""]);
  const [cntUser, setCntUser] = useState("");
  useEffect(() => {
    const getUserNameFromLocalStorage = async () => {
      let user = await localStorage.getItem("username");
      if (user) {
        setCntUser(user);
      }
    };
    getUserNameFromLocalStorage();
  }, []);

  return (
    <>
      <GroupSelectSidebar setCntRoomName={setCntRoomName} username={cntUser} />
      <Header />
      <SingleGroupSidebar cntRoomName={cntRoomName} />
      <Chatting cntRoomName={cntRoomName} username={cntUser} />
    </>
  );
}

export default ChattingRoom;
