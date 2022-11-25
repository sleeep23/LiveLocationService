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
  justify-content: space-around;
  gap: 40px;
  border-radius: 16px;
  border: 1px solid #747bff;
`;

const IconContainer = styled.div`
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  margin-top: 20px;
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
          <ProductAdminUsersIcon decorative={true} />
        ) : (
          <ChatIcon decorative={true} />
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
        <Heading as="h3" variant="heading30">
          {service}
        </Heading>
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
