import styled from "styled-components";

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

function UserListItem({ username, idx }: { username: string; idx: number }) {
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
      <input type="checkbox" />
    </UserListItemContainer>
  );
}

export default UserListItem;
