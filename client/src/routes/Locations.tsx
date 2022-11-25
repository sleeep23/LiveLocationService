import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Heading } from "@twilio-paste/core/heading";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const UserListItem = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  background-color: #1a1a1a;
`;

const MapAndListContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

function Locations() {
  return (
    <LocationContainer>
      <Heading as="h1" variant="heading10">
        Find near locations!
      </Heading>
      <MapAndListContainer>
        <MapContainer>
          <Map
            center={{ lat: 33.5563, lng: 126.79581 }}
            style={{ width: "100%", height: "100%", borderRadius: "16px" }}
          >
            <MapMarker
              position={{ lat: 33.55635, lng: 126.795841 }}
            ></MapMarker>
          </Map>
        </MapContainer>
        <UserListContainer>
          <UserListItem />
        </UserListContainer>
      </MapAndListContainer>
    </LocationContainer>
  );
}

export default Locations;
