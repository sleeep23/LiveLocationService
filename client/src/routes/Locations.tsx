import styled from "styled-components";

import { Heading } from "@twilio-paste/core/heading";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useGeoloaction, { locationType } from "../hook/useGeoloaction";
import UserList from "../components/List/UserList";
import MapWithLocations from "../components/Map/MapWithLocations";
import { userLocations, UserLocationType } from "../const/userInfos";

// socket connection
import { io } from "socket.io-client";
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
  const [users, setUsers] = useState<Array<UserLocationType>>([
    { nickname: "John", location: { lat: 35, lng: 36 } },
    { nickname: "John", location: { lat: 35, lng: 36 } },
    { nickname: "John", location: { lat: 35, lng: 36 } },
    { nickname: "John", location: { lat: 35, lng: 36 } },
    { nickname: "John", location: { lat: 35, lng: 36 } },
  ]);
  const [checkedUsers, setCheckedUsers] = useState<Set<number> | undefined>();
  const [nickname, setNickname] = useState("");
  const [locationChanged, setLocationChanged] = useState(false);
  const cntLocation: locationType = useGeoloaction();
  console.log(checkedUsers);
  useEffect(() => {
    // Get user's nickname from browser's localStorage
    const item: string | null = window.localStorage.getItem("nickname");
    const user = JSON.parse(item as string);
    setNickname(user.nickname);

    // Send the user's nickname to socketIO server
    socket.emit("add_user", { nickname: user.nickname });
    console.log(cntLocation);
    // Send the user's location to the server with the user nickname
    if (locationChanged) {
      socket.emit("update_location", {
        nickname: user.nickname,
        location: {
          lat: cntLocation.coordinates?.lat,
          lng: cntLocation.coordinates?.lng,
        },
      });
    } else {
      socket.emit("add_user_location", {
        nickname: user.nickname,
        location: {
          lat: cntLocation.coordinates?.lat,
          lng: cntLocation.coordinates?.lng,
        },
      });
      setLocationChanged(true);
    }

    // Send the get_location event to the socketIO server to get the users locations list
    socket.emit("get_location");

    // If socketIO server sends the users' locations, cache the list and render it.
    socket.on("send_location", (data) => {
      // setUsers([...data]);
      console.log(data);
    });

    // Send the user's nickname to the socketIO server
    socket.on("get_user_nickname", () => {
      socket.emit("send_user_nickname", nickname);
    });
  }, [socket, userLocations, nickname, cntLocation, locationChanged]);

  return (
    <LocationContainer>
      <h1
        style={{
          lineHeight: "1.4",
          margin: "0",
          boxSizing: "border-box",
          paddingTop: "40px",
        }}
      >
        Hello {nickname} 👋! Find your friends' locations!
      </h1>
      <NavLinkContainer>
        <LinkContainer to="/">👉 Go to Main Menu</LinkContainer>
        <LinkContainer to="/">👉 Go to Chatting</LinkContainer>
      </NavLinkContainer>
      <MapAndListContainer>
        <MapWithLocations cntLocation={cntLocation} users={users} />
        <UserList users={users} setCheckedUsers={setCheckedUsers} />
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
