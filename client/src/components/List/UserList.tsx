import React from "react";
import { UserLocationType } from "../../types/userInfos";
import UserListItem from "./UserListItem";
import styled from "styled-components";

const UserListContainer = styled.div`
  box-sizing: border-box;
  background-color: #1a1a1a;
  border-radius: 16px;
  width: 280px;
  height: 400px;
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
  setCheckedUsers,
}: {
  users: UserLocationType[];
  setCheckedUsers: React.Dispatch<
    React.SetStateAction<Set<number> | undefined>
  >;
}) {
  return (
    <UserListContainer>
      {users.map((user, idx) => {
        return (
          <UserListItem
            key={idx}
            username={user.nickname}
            idx={idx}
            setCheckedUsers={setCheckedUsers}
          />
        );
      })}
    </UserListContainer>
  );
}

export default UserList;
