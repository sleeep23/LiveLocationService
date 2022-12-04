import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useGeoloaction, { locationType } from "../hook/useGeoloaction";
import UserList from "../components/List/UserList";
import MapWithLocations from "../components/Map/MapWithLocations";
import { userLocations, UserLocationType } from "../types/userInfos";

// socket connection
import { io } from "socket.io-client";
import axios from "axios";

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
interface LocationProp {
  lat: number;
  lng: number;
}

function Locations({ username }: { username: string }) {
  const [users, setUsers] = useState<Array<UserLocationType>>([]);
  const [checkedUsers, setCheckedUsers] = useState<Set<number> | undefined>();
  // const [newUser, setNewUser] = useState(true);
  const [locationChanged, setLocationChanged] = useState(false);
  const [location, setLocation] = useState<LocationProp>({ lat: 35, lng: 35 });
  // types [nickname, setNickname] = useState("");
  const cntLocation: locationType = useGeoloaction();
  console.log(cntLocation);

  useEffect(() => {
    // Send the user's location to the server with the user nickname
    const getLocation = async () => {
      const locationData = await axios
        .get(
          "https://ipgeolocation.abstractapi.com/v1/?api_key=daf9e325320547d9ab6e8f93060215d3"
        )
        .then((response) => {
          return response;
        });

      if (username !== "") {
        if (locationChanged) {
          await socket.emit("update_location", {
            nickname: username,
            location: {
              lat: locationData.data.latitude,
              lng: locationData.data.longitude,
            },
          });
        } else {
          await socket.emit("addUserLocation", {
            nickname: username,
            location: {
              lat: locationData.data.latitude,
              lng: locationData.data.longitude,
            },
          });
          await setLocationChanged(true);
        }

        await socket.emit("get_location");
        await socket.on("send_locations", (data) => {
          if (data) {
            setUsers(data as Array<UserLocationType>);
          }
        });
      }
    };
    getLocation();
  }, [socket, userLocations, username, locationChanged]);

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
        <MapWithLocations cntLocation={cntLocation} users={users} />
        <UserList users={users} setCheckedUsers={setCheckedUsers} />
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
