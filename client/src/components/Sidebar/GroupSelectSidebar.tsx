import styled from "styled-components";
import { Avatar } from "@twilio-paste/core/avatar";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import React, { useEffect, useState } from "react";

// socket io connection
import { io } from "socket.io-client";
const socket = io("http://localhost:5100");

const GroupMenuIconContainer = styled.div`
  box-sizing: border-box;
  background-color: #747bff;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  padding: 8px;
  :hover {
    //border-radius: 12px;
    background-color: #213547;
    transition: ease-out 0.1s;
  }
`;

const GroupSidebarContainer = styled.div`
  box-sizing: border-box;
  background-color: #1a1a1a;
  width: 72px;
  height: 100vh;
  position: fixed;
  //overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 24px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

function GroupMenu({
  roomName,
  setRoomName,
}: {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onClickHandler = () => {
    setRoomName(roomName);
    socket.emit("joinRoom", roomName);
  };
  return (
    <GroupMenuIconContainer
      onClick={() => {
        setRoomName(roomName);
      }}
    >
      <Avatar size="sizeIcon70" name={roomName} />
    </GroupMenuIconContainer>
  );
}

function GroupSelectSidebar({
  setCntRoomName,
  username,
}: {
  setCntRoomName: React.Dispatch<React.SetStateAction<string>>;
  username: string;
}) {
  const [myRooms, setMyRooms] = useState<Array<string>>();
  useEffect(() => {
    let user_name = localStorage.getItem("username");
    socket.emit("get_rooms", user_name);
    socket.on("send_rooms", (rooms) => {
      console.log(rooms);
      setMyRooms(rooms);
    });
  }, [socket]);

  // const groups = ["Group1", "Group2", "Group3", "Group4", "Group5"];
  const contents = myRooms?.map((room, idx) => {
    return <GroupMenu key={idx} roomName={room} setRoomName={setCntRoomName} />;
  });
  return <GroupSidebarContainer>{contents}</GroupSidebarContainer>;
}

export default GroupSelectSidebar;
