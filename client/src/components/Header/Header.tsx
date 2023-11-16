import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.div`
  box-sizing: border-box;
  width: calc(100% - 72px);
  height: 48px;
  position: fixed;
  left: 72px;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: flex-end;
`;

function Header() {
  const navigator = useNavigate();
  return (
    <HeaderContainer>
      <button
        style={{
          boxSizing: "border-box",
          backgroundColor: "#f2f4f6",
          borderRadius: "16px",
          height: "100%",
          padding: "0 4px",
        }}
        onClick={() => navigator("/")}
      >
        Back to Main Menu
      </button>
    </HeaderContainer>
  );
}

export default Header;
