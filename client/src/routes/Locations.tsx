import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserList from "../components/List/UserList";
import MapWithLocations from "../components/Map/MapWithLocations";
import { UserLocationType } from "../types/userInfos";

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

export interface LocationProp {
  lat: number;
  lng: number;
}

function Locations({ username, isNew }: { username: string; isNew: boolean }) {
  const [users, setUsers] = useState<Array<UserLocationType>>([]);
  const [cntUser, setCntUser] = useState("");
  // const [location, setLocation] = useState<LocationProp>({
  //   lat: 35.2301898,
  //   lng: 126.843083,
  // });
  useEffect(() => {
    addAndUpdate();
  }, [navigator, isNew, localStorage]);
  const addAndUpdate = async () => {
    let user_name = await localStorage.getItem("username");
    if (user_name) {
      setCntUser(user_name);
    }
    await navigator.geolocation.getCurrentPosition((res) => {
      // setLocation({ lat: res.coords.latitude, lng: res.coords.longitude });
      console.log(res);
      if (user_name !== "") {
        console.log(isNew);
        if (!isNew) {
          if (res) {
            socket.emit("update_location", {
              nickname: user_name,
              location: {
                lat: res.coords.latitude,
                lng: res.coords.longitude,
              },
            });
            console.log("User location updated!");
          } else {
            console.log("Waiting for location info from browser");
          }
        } else {
          socket.emit("addUserLocation", {
            nickname: user_name,
            location: {
              lat: res.coords.latitude,
              lng: res.coords.longitude,
            },
          });
          console.log("User location added!");
        }
      }
    });
  };

  useEffect(() => {
    socket.emit("get_location");
    socket.on("send_locations", (data) => {
      if (data) {
        // console.log(data);
        setUsers(data as Array<UserLocationType>);
      }
    });
  }, [socket]);

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
        Hello {cntUser} 👋! Find your friends' locations!
      </h1>
      <NavLinkContainer>
        <LinkContainer to="/">👉 Go to Main Menu</LinkContainer>
        <LinkContainer to="/chat">👉 Go to Chatting</LinkContainer>
      </NavLinkContainer>
      <MapAndListContainer>
        <MapWithLocations users={users} />
        <UserList users={users} username={username} />
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
