import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import useGeoloaction, { locationType } from "../../hook/useGeoloaction";
import { LocationType, UserLocationType } from "../../types/userInfos";

interface MapProps {
  users: Array<UserLocationType>;
}

const MapContainer = styled.div`
  box-sizing: border-box;
  width: 600px;
  height: 400px;
  border-radius: 16px;
`;

function MapWithLocations({ users }: MapProps) {
  const cntLocation: locationType = useGeoloaction();
  return (
    <MapContainer>
      <Map
        center={{
          lat: (cntLocation.coordinates?.lat as number) || 35.5,
          lng: (cntLocation.coordinates?.lng as number) || 34.5,
        }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
        }}
        zoomable={true}
      >
        {users.map((user: UserLocationType, idx) => {
          console.log(user);
          const temp = user.lat
            ? { lat: user.lat, lng: user.lng }
            : { lat: 35.1962, lng: 126.9248 };
          return (
            <MapMarker
              position={temp}
              title={user.user_name}
              key={idx}
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 12, height: 18 },
              }}
              clickable={true}
            ></MapMarker>
          );
        })}
      </Map>
    </MapContainer>
  );
}

export default MapWithLocations;
