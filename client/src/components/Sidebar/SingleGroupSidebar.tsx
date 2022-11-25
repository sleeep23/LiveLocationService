import React from "react";
import styled from "styled-components";

const SingleGroupSidebarContainer = styled.div`
  background-color: #242424;
  width: 240px;
  height: calc(100vh - 48px);
  position: fixed;
  left: 72px;
  top: 48px;
`;

function SingleGroupSidebar() {
  return <SingleGroupSidebarContainer></SingleGroupSidebarContainer>;
}

export default SingleGroupSidebar;
