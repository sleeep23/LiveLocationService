import styled from "styled-components";
import { Avatar } from "@twilio-paste/core/avatar";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import React, { useState } from "react";

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
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 24px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

function GroupMenu({
  group_name,
  setGroup,
}: {
  group_name: string;
  setGroup: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <GroupMenuIconContainer
      onClick={() => {
        setGroup(group_name);
      }}
    >
      <Avatar size="sizeIcon70" name={group_name} icon={UserIcon} />
    </GroupMenuIconContainer>
  );
}

function GroupSelectSidebar({
  setGroup,
}: {
  setGroup: React.Dispatch<React.SetStateAction<string>>;
}) {
  const groups = ["Group1", "Group2", "Group3", "Group4", "Group5"];
  const contents = groups.map((val, idx) => {
    return <GroupMenu key={idx} group_name={val} setGroup={setGroup} />;
  });
  return <GroupSidebarContainer>{contents}</GroupSidebarContainer>;
}

export default GroupSelectSidebar;
