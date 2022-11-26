import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Heading } from "@twilio-paste/core/heading";
import { useEffect, useRef, useState } from "react";

// socket connection
import { io } from "socket.io-client";
import { userLocations, UserLocationType } from "../const/userInfos";
import useGeoloaction from "../hook/useGeoloaction";
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
const MapContainer = styled.div`
  box-sizing: border-box;
  width: 800px;
  height: 600px;
  border-radius: 16px;
`;
const UserListContainer = styled.div`
  box-sizing: border-box;
  background-color: #1a1a1a;
  border-radius: 16px;
  width: 280px;
  height: 600px;
  overflow-y: scroll;
  gap: 10px;
  padding: 10px;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    //display: none;
    width: 0;
  }
`;
const UserListItemContainer = styled.div`
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-top: 0;
  padding: 20px;
  width: 100%;
  height: 80px;
  border-radius: 16px;
  background-color: #888888;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;
const MapAndListContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

function UserListItem({ username, idx }: { username: string; idx: number }) {
  return (
    <UserListItemContainer>
      <p style={{ fontSize: "20px" }}>User {idx + 1} :</p>
      <p style={{ fontSize: "20px" }}>{username}</p>
    </UserListItemContainer>
  );
}

function Locations() {
  /**
   * @note Error occurs when loading KaKao Map UI -> Partially resolved
   */
  const [nickname, setNickname] = useState("");
  const [users, setUsers] = useState<Array<UserLocationType>>([]);
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
  const markers = users.map((users, idx) => {
    return (
      <MapMarker position={users.location} title={users.nickname} key={idx}>
        <div style={{ fontSize: "12px", padding: "5px", color: "#000" }}>
          {users.nickname}
        </div>
      </MapMarker>
    );
  });
  return (
    <LocationContainer>
      <Heading as="h1" variant="heading10">
        Hello {nickname} 👋 <br /> Find your friends' locations!
      </Heading>
      <MapAndListContainer>
        <MapContainer>
          <Map
            center={{
              lat: cntLocation.coordinates?.lat as number,
              lng: cntLocation.coordinates?.lng as number,
            }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "16px",
            }}
            zoomable={true}
          >
            {markers}
          </Map>
        </MapContainer>
        <UserListContainer>
          {users.map((user, idx) => {
            return (
              <UserListItem key={idx} username={user.nickname} idx={idx} />
            );
          })}
        </UserListContainer>
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
