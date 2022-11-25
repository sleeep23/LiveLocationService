import React, { useState } from "react";
import styled from "styled-components";
import { Heading } from "@twilio-paste/core/heading";
import Contents from "../components/Contents";
import { Link, Outlet, useNavigate } from "react-router-dom";

interface IProps {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainPageContainer = styled.div`
  background-color: #242424;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LoginButton = styled(Link)`
  box-sizing: border-box;
  margin-top: 40px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #747bff;
  color: white;
  border: unset;
  text-decoration: unset;
`;

function Introduction({ login, setLogin }: IProps) {
  return (
    <>
      <MainPageContainer>
        <Heading as="h1" variant="heading10" marginBottom="space0">
          Welcome to <span>Live Location Service !</span>
        </Heading>
        {!login && (
          <LoginButton
            to="/login"
            onClick={() => {
              setLogin(true);
            }}
          >
            ✊ Login First!
          </LoginButton>
        )}
        {login && <Contents />}
      </MainPageContainer>
      <Outlet />
    </>
  );
}

export default Introduction;
