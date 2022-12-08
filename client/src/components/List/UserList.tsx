import React, { useState } from "react";
import { UserLocationType } from "../../types/userInfos";
import UserListItem from "./UserListItem";
import styled from "styled-components";

// socket connection
import { io } from "socket.io-client";
const socket = io("http://localhost:5100");

const UserListContainer = styled.div`
  box-sizing: border-box;
  background-color: #1a1a1a;
  border-radius: 16px;
  width: 280px;
  height: 340px;
  overflow-y: scroll;
  gap: 10px;
  padding: 10px;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    //display: none;
    width: 0;
  }
`;

function UserList({
  users,
  username,
}: {
  users: UserLocationType[];
  username: string;
}) {
  const [checkedUsers, setCheckedUsers] = useState<Set<number> | undefined>();
  console.log(checkedUsers);
  let user_index: number[] = [];
  if (checkedUsers) {
    user_index = Array.from(checkedUsers);
    console.log(user_index.sort());
  }
  const onClickHandler = () => {
    let user_name = localStorage.getItem("username");
    if (user_index.toString() !== "[]") {
      socket.emit("createRoom", {
        user_name: user_name,
        idx_arr: user_index.sort(),
      });
      alert("Room created! Check your chatting room!");
    }
  };
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "400px",
        justifyContent: "space-between",
      }}
    >
      <UserListContainer>
        {users.map((user, idx) => {
          return (
            <UserListItem
              key={idx}
              username={user.user_name}
              idx={idx}
              setCheckedUsers={setCheckedUsers}
            />
          );
        })}
      </UserListContainer>
      <button
        style={{
          height: "48px",
          boxSizing: "border-box",
          border: "unset",
          borderRadius: "16px",
          backgroundColor: "#1c1c1c",
          color: "white",
        }}
        onClick={onClickHandler}
      >
        Make a chatting room
      </button>
    </div>
  );
}

export default UserList;
