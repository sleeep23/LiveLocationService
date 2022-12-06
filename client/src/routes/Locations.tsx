import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserList from "../components/List/UserList";
import MapWithLocations from "../components/Map/MapWithLocations";
import { userLocations, UserLocationType } from "../types/userInfos";
import axios from "axios";

// socket connection
import { io } from "socket.io-client";
import useGeoloaction, { locationType } from "../hook/useGeoloaction";
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

interface UsernameProps {
  username: string;
}
export interface LocationProp {
  lat: number;
  lng: number;
}

function Locations({ username, isNew }: { username: string; isNew: boolean }) {
  const [users, setUsers] = useState<Array<UserLocationType>>([]);
  const [checkedUsers, setCheckedUsers] = useState<Set<number> | undefined>();
  const [location, setLocation] = useState<LocationProp>({ lat: 35, lng: 35 });
  const cntLocation: locationType = useGeoloaction();
  useEffect(() => {
    const setNavigatorlocation = async () => {
      let temp = {
        lat: 35.23018987720772,
        lng: 126.84308370285073,
      };
      if (cntLocation.loaded) {
        temp = {
          lat: cntLocation.coordinates?.lat as number,
          lng: cntLocation.coordinates?.lng as number,
        };
      }
      setLocation(temp);
    };
    setNavigatorlocation();
  }, [cntLocation]);

  useEffect(() => {
    if (username !== "") {
      if (!isNew) {
        socket.emit("update_location", {
          nickname: username,
          location: location,
        });
        console.log("User location updated!");
      } else {
        socket.emit("addUserLocation", {
          nickname: username,
          location: location,
        });
        console.log("User location added!");
      }
    }

    socket.emit("get_location");
    socket.on("send_locations", (data) => {
      if (data) {
        console.log(data);
        setUsers(data as Array<UserLocationType>);
      }
    });
  }, [socket, isNew, username]);

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
        Hello {username} 👋! Find your friends' locations!
      </h1>
      <NavLinkContainer>
        <LinkContainer to="/">👉 Go to Main Menu</LinkContainer>
        <LinkContainer to="/">👉 Go to Chatting</LinkContainer>
      </NavLinkContainer>
      <MapAndListContainer>
        <MapWithLocations users={users} />
        <UserList users={users} setCheckedUsers={setCheckedUsers} />
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
