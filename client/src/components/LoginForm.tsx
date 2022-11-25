import React from "react";
import styled from "styled-components";
import { Label } from "@twilio-paste/core/label";
import { Heading } from "@twilio-paste/core/heading";
import Login from "../routes/Login";
import { Link } from "react-router-dom";

interface InputProps {
  inputContent: string;
}

const LoginFormContainer = styled.div`
  box-sizing: border-box;
  border-radius: 16px;
  background-color: #f9f9f9;
  width: 480px;
  height: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const NicknameInput = styled.input`
  box-sizing: border-box;
  border: 1px solid #888888;
  margin: 4px;
  padding: 8px;
  width: 90%;
  border-radius: 4px;
`;

const SubmitButton = styled(Link)`
  box-sizing: border-box;
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #747bff;
  color: white;
  border: unset;
  text-decoration: unset;
`;

function SingleInputForm({ inputContent }: InputProps) {
  return (
    <div
      style={{
        width: "400px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <Label htmlFor={inputContent} required>
        Enter {inputContent}
      </Label>
      <NicknameInput
        aria-describedby="nickname"
        id={inputContent}
        name="nickname"
        type={inputContent === "password" ? "password" : "text"}
        placeholder="Enter your information"
        required
      />
    </div>
  );
}

function LoginForm() {
  return (
    <LoginFormContainer>
      <div style={{ paddingBottom: "40px" }}>
        <Heading as="h1" variant="heading10">
          Login to LLS
        </Heading>
      </div>
      <SingleInputForm inputContent="nickname" />
      <SingleInputForm inputContent="password" />
      <SubmitButton to="/">Login 👉</SubmitButton>
    </LoginFormContainer>
  );
}

export default LoginForm;
