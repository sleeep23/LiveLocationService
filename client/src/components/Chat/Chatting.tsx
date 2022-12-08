import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ChatBubble,
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
} from "@twilio-paste/core";
import { Avatar } from "@twilio-paste/core/avatar";

// socket io connection
import { io } from "socket.io-client";
const socket = io("http://localhost:5100");

interface ChatMessageProps {
  user_name: string;
  room_name: string;
  message: string;
  time: Date | number;
}

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

function Chatting({
  cntRoomName,
  username,
}: {
  cntRoomName: string;
  username: string;
}) {
  const [chatMessage, setChatMessage] = useState<Array<ChatMessageProps>>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  // chat message update & get current room chat messages

  // get room members
  useEffect(() => {
    socket.emit("joinRoom", cntRoomName);
    socket.emit("get_chat_messages", cntRoomName);
    socket.on("send_chat_messages", async (chats) => {
      setChatMessage(chats);
    });
  }, [cntRoomName]);

  const onSendHandler = async () => {
    const userMessage: ChatMessageProps = {
      user_name: username,
      room_name: cntRoomName,
      message: userInput,
      time: 1,
    };
    await setChatMessage((prevState) => {
      return [...prevState, userMessage];
    });
    await socket.emit("update_chat_messages", {
      user_name: username,
      room_name: cntRoomName,
      message: userInput,
    });
    await console.log("Send chat message!");
  };

  useEffect(() => {
    socket.on("send_updated_chat_messages", async (updated) => {
      setChatMessage((prevState) => {
        return [...prevState, updated];
      });
    });
    console.log("Chat message updated!");
  }, [socket]);

  const chatLogs = chatMessage?.map((chat, idx) => {
    if (chat.user_name === username) {
      return (
        <ChatMessage variant="outbound" key={idx}>
          <ChatBubble>{chat.message}</ChatBubble>
          <ChatMessageMeta aria-label="said by you">
            <ChatMessageMetaItem>other</ChatMessageMetaItem>
          </ChatMessageMeta>
        </ChatMessage>
      );
    } else {
      return (
        <ChatMessage variant="inbound" key={idx}>
          <ChatBubble>{chat.message}</ChatBubble>
          <ChatMessageMeta aria-label="said by members">
            <ChatMessageMetaItem>
              <Avatar name="Gibby Radki" size="sizeIcon20" />
              {chat.user_name} ・ me
            </ChatMessageMetaItem>
          </ChatMessageMeta>
        </ChatMessage>
      );
    }
  });

  return (
    <ChattingContainer>
      <ChatLog>{chatLogs}</ChatLog>
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ChatInputContainer
          placeholder="Type your chat message"
          onChange={(event) => setUserInput(event.target.value)}
        />
        <button
          style={{
            boxSizing: "border-box",
            margin: "16px",
            padding: "16px",
            border: "1px solid white",
            borderRadius: "16px",
            backgroundColor: "white",
            color: "#1a1a1a",
          }}
          onClick={onSendHandler}
        >
          Send
        </button>
      </div>
    </ChattingContainer>
  );
}

export default Chatting;
