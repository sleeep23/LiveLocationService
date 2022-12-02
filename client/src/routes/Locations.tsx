import styled from "styled-components";

import { Heading } from "@twilio-paste/core/heading";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// socket connection
import { io } from "socket.io-client";
import { userLocations, UserLocationType } from "../const/userInfos";
import useGeoloaction from "../hook/useGeoloaction";
import UserList from "../components/List/UserList";
import MapWithLocations from "../components/Map/MapWithLocations";
const socket = io("http://localhost:5100");

const LocationContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  background-color: #242424;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;
`;
const MapAndListContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
const NavLinkContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;
const LinkContainer = styled(Link)`
  text-decoration: unset;
  color: white;
  box-sizing: border-box;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #646cff;
  :hover {
    background-color: #747bff;
  }
`;

function Locations() {
  const [users, setUsers] = useState<Array<UserLocationType>>([]);
  const [checkedUsers, setCheckedUsers] = useState<Array<UserLocationType>>([]);
  const [nickname, setNickname] = useState("");
  const cntLocation = useGeoloaction();

  useEffect(() => {
    // Get user's nickname from browser's localStorage
    const item: string | null = window.localStorage.getItem("nickname");
    const user = JSON.parse(item as string);
    setNickname(user.nickname);

    // Send the user's nickname to socketIO server
    socket.emit("addUser", { nickname: user.nickname });

    // Send the user's location to the server with the user nickname
    socket.emit("addUserLocation", {
      nickname: user.nickname,
      location: {
        lat: cntLocation.coordinates?.lat,
        lng: cntLocation.coordinates?.lng,
      },
    });

    // Send the getUserLocations event to the socketIO server to get the users locations list
    socket.emit("getUserLocations");

    // If socketIO sent the users' locations, cache the list and render it.
    socket.on("sendUserLocations", (data) => {
      setUsers([...data]);
    });

    // Send the user's nickname to the socketIO server
    socket.on("get_user_nickname", () => {
      socket.emit("send_user_nickname", nickname);
    });
  }, [socket, userLocations, nickname, cntLocation]);
  console.log(users);
  return (
    <LocationContainer>
      <Heading as="h1" variant="heading10">
        Hello {nickname} 👋 <br /> Find your friends' locations!
      </Heading>
      <NavLinkContainer>
        <LinkContainer to="/">👉 Go to Main Menu</LinkContainer>
        <LinkContainer to="/">👉 Go to Chatting</LinkContainer>
      </NavLinkContainer>
      <MapAndListContainer>
        <MapWithLocations cntLocation={cntLocation} users={users} />
        <UserList users={users} />
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
