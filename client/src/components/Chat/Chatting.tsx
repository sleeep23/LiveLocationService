import React, { useState } from "react";
import styled from "styled-components";
import {
  ChatBubble,
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
} from "@twilio-paste/core";
import { Avatar } from "@twilio-paste/core/avatar";

const ChattingContainer = styled.div`
  box-sizing: border-box;
  background-color: #1b1b1b;
  position: absolute;
  width: calc(100% - 312px);
  height: calc(100vh - 48px);
  left: 312px;
  top: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatInputContainer = styled.input`
  box-sizing: border-box;
  padding: 16px;
  margin: 16px;
  width: calc(100% - 32px);
  background-color: #1b1b1b;
  border: 1px solid #747bff;
  color: white;
  border-radius: 16px;
`;

function Chatting({ cntRoomId }: { cntRoomId: string }) {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  // chat message update & get current room chat messages
  // get room members
  return (
    <ChattingContainer>
      <ChatLog>
        <ChatMessage variant="inbound">
          <ChatBubble>Hello, what can I help you with?</ChatBubble>
          <ChatMessageMeta aria-label="said by Gibby Radki at 3:35 PM">
            <ChatMessageMetaItem>
              <Avatar name="Gibby Radki" size="sizeIcon20" />
              Gibby Radki ・ 3:35 PM
            </ChatMessageMetaItem>
          </ChatMessageMeta>
        </ChatMessage>
        <ChatMessage variant="outbound">
          <ChatBubble>Hi! What is your return policy?</ChatBubble>
          <ChatMessageMeta aria-label="said by you at 3:35 PM">
            <ChatMessageMetaItem>3:35 PM</ChatMessageMetaItem>
          </ChatMessageMeta>
        </ChatMessage>
      </ChatLog>
      <ChatInputContainer
        placeholder="Type your chat message"
        onChange={(event) => setChatMessage(event.target.value)}
      />
    </ChattingContainer>
  );
}

export default Chatting;
