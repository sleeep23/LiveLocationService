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

function Login() {
  return (
    <LoginPageContainer>
      <LoginForm />
    </LoginPageContainer>
  );
}

export default Login;
