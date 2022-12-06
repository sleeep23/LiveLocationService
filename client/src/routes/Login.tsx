import React from "react";
import styled from "styled-components";
import LoginForm from "../components/LoginForm";

const LoginPageContainer = styled.div`
  background-color: #242424;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Login({
  setUsername,
  setIsNew,
}: {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <LoginPageContainer>
      <LoginForm setUsername={setUsername} setIsNew={setIsNew} />
    </LoginPageContainer>
  );
}

export default Login;
