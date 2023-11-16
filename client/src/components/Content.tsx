import React from "react";
import styled from "styled-components";
import { Heading } from "@twilio-paste/core/heading";
import { ProductAdminUsersIcon } from "@twilio-paste/icons/esm/ProductAdminUsersIcon";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { Link } from "react-router-dom";

interface SProps {
  iconType: "location" | "chat";
  service: string;
}

const ContentContainer = styled.div`
  box-sizing: border-box;
  padding: 28px;
  width: 300px;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  border-radius: 16px;
  border: 1px solid #747bff;
`;

const IconContainer = styled.div`
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  margin-top: 20px;
  background-color: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconLinkContainer = styled(Link)`
  width: fit-content;
  text-decoration: unset;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  :hover {
    background-color: #213547;
    transition: linear 0.15s;
  }
`;

function Content({ iconType, service }: SProps) {
  return (
    <ContentContainer>
      <IconContainer>
        {iconType === "location" ? (
          <ProductAdminUsersIcon size="sizeIcon70" decorative={true} />
        ) : (
          <ChatIcon
            size="sizeIcon70"
            decorative={true}
            style={{ color: "white" }}
          />
        )}
      </IconContainer>
      <div
        style={{
          display: "flex",
          textAlign: "center",
          wordBreak: "keep-all",
          lineHeight: "1.4",
        }}
      >
        <h2 style={{ color: "white", margin: "0" }}>{service}</h2>
      </div>
      {iconType === "location" ? (
        <IconLinkContainer to="/locations">
          👉 Explore locations
        </IconLinkContainer>
      ) : (
        <IconLinkContainer to="/chat">👉 Chat with friends</IconLinkContainer>
      )}
    </ContentContainer>
  );
}

export default Content;
