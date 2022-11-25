import styled from "styled-components";
import { Avatar } from "@twilio-paste/core/avatar";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";

const GroupMenuIconContainer = styled.div`
  box-sizing: border-box;
  background-color: #747bff;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  padding: 8px;
  :hover {
    border-radius: 12px;
    transition: ease-out 0.25s;
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
`;

function GroupMenu({ group_name }: { group_name: string }) {
  return (
    <GroupMenuIconContainer>
      <Avatar size="sizeIcon70" name={group_name} icon={UserIcon} />
    </GroupMenuIconContainer>
  );
}

function GroupSelectSidebar() {
  const Groups = ["Group1", "Group2", "Group3", "Group4", "Group5"];
  const contents = Groups.map((val, idx) => {
    return <GroupMenu key={idx} group_name={val} />;
  });
  return <GroupSidebarContainer>{contents}</GroupSidebarContainer>;
}

export default GroupSelectSidebar;
