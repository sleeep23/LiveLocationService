import React from "react";
import styled from "styled-components";
import { Label } from "@twilio-paste/core/label";
import { Heading } from "@twilio-paste/core/heading";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// socket io connection
import { io } from "socket.io-client";
const socket = io("http://localhost:5100");

interface InputProps {
  user_name: string;
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
const SubmitButton = styled.button`
  box-sizing: border-box;
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #747bff;
  color: white;
  border: unset;
  text-decoration: unset;
`;

function LoginForm({
  setUsername,
  setIsNew,
  setLogin,
  isNew,
}: {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
}) {
  const { register, handleSubmit } = useForm<InputProps>();
  const navigator = useNavigate();
  const onSubmit = async (user: InputProps) => {
    if (user.user_name.includes(" ")) {
      alert("Please enter a one word nickname!");
    } else {
      await setUsername(user.user_name);
      await localStorage.setItem("username", user.user_name);
      await socket.emit("get_user_list");
      await socket.on("send_user_list", (list) => {
        console.log("Here is the list!");
        console.log(list);
        let isNew = true;
        list.forEach((item: { user_name: string }) => {
          if (item.user_name === user.user_name) {
            isNew = false;
          }
        });
        if (!isNew) {
          setIsNew(false);
        } else {
          setIsNew(true);
          socket.emit("addUser", { nickname: user.user_name });
        }
      });
      navigator("/");
    }
  };
  return (
    <LoginFormContainer>
      <div style={{ paddingBottom: "40px" }}>
        <Heading as="h1" variant="heading10">
          Login to LLS
        </Heading>
      </div>
      <form
        style={{
          width: "400px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Label htmlFor="nickname" required>
          Enter nickname
        </Label>
        <NicknameInput
          aria-describedby="nickname"
          id="nickname"
          {...register("user_name", { required: true })}
          type="text"
          placeholder="Enter your information"
          required
        />
        <SubmitButton
          type="submit"
          value="Login 👉"
          onClick={(event) => {
            setLogin(true);
          }}
        >
          Login 👉
        </SubmitButton>
      </form>
    </LoginFormContainer>
  );
}

export default LoginForm;
