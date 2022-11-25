import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  box-sizing: border-box;
  width: calc(100% - 72px);
  height: 48px;
  position: fixed;
  left: 72px;
  background-color: #1a1a1a;
`;

function Header() {
  return <HeaderContainer></HeaderContainer>;
}

export default Header;
