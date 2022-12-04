import styled from "styled-components";
import React, { useState } from "react";

const UserListItemContainer = styled.div`
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-top: 0;
  padding: 20px;
  width: 100%;
  height: 48px;
  border-radius: 16px;
  background-color: #242424;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

function UserListItem({
  username,
  idx,
  setCheckedUsers,
}: {
  username: string;
  idx: number;
  setCheckedUsers: React.Dispatch<
    React.SetStateAction<Set<number> | undefined>
  >;
}) {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const onClickHandler = () => {
    setIsClicked((prev) => !prev);
    if (!isClicked) {
      setCheckedUsers((prevState) => {
        const users = [idx];
        prevState?.forEach((user) => {
          users.push(user);
        });
        return new Set(users);
      });
    } else {
      setCheckedUsers((prevState) => {
        const users: number[] = [];
        prevState?.forEach((user) => {
          users.push(user);
        });
        const result = users.filter((user) => user !== idx);
        return new Set(result);
      });
    }
  };
  return (
    <UserListItemContainer>
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            margin: "0",
            fontSize: "18px",
            boxSizing: "border-box",
            marginRight: "8px",
          }}
        >
          User {idx + 1} :
        </p>
        <p
          style={{
            margin: "0",
            fontSize: "18px",
            boxSizing: "border-box",
            marginRight: "8px",
          }}
        >
          {username}
        </p>
      </div>
      <input type="checkbox" onClick={onClickHandler} />
    </UserListItemContainer>
  );
}

export default UserListItem;
