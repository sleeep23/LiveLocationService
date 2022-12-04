import React, { useState } from "react";
import styled from "styled-components";

const SingleGroupSidebarContainer = styled.div`
  box-sizing: border-box;
  padding: 40px;
  background-color: #242424;
  width: 240px;
  height: calc(100vh - 48px);
  position: fixed;
  left: 72px;
  top: 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function SingleGroupSidebar() {
  const [members, setMembers] = useState([
    "member1",
    "member2",
    "member3",
    "member4",
  ]);
  const memberListContent = members.map((item, index) => {
    return (
      <p style={{ color: "white" }} key={index}>
        {item}
      </p>
    );
  });
  return (
    <SingleGroupSidebarContainer>
      <h2 style={{ color: "white" }}>Members</h2>
      {memberListContent}
    </SingleGroupSidebarContainer>
  );
}

export default SingleGroupSidebar;
