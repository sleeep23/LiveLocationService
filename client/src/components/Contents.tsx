import React from "react";
import styled from "styled-components";
import Content from "./Content";

const ContentsContainer = styled.div`
  box-sizing: border-box;
  width: fit-content;
  height: fit-content;
  margin-top: 40px;
  padding: 40px;
  display: flex;
  flex-direction: row;
  gap: 40px;
`;

function Contents() {
  return (
    <ContentsContainer>
      <Content
        service="View live locations of you and your friends!"
        iconType="location"
      />
      <Content
        service="Contact with your friends by chatting in text and video"
        iconType="chat"
      />
    </ContentsContainer>
  );
}

export default Contents;
