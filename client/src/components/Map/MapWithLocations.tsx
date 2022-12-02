import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { locationType } from "../../hook/useGeoloaction";
import { UserLocationType } from "../../const/userInfos";

interface MapProps {
  cntLocation: locationType;
  users: UserLocationType[];
}

const MapContainer = styled.div`
  box-sizing: border-box;
  width: 600px;
  height: 400px;
  border-radius: 16px;
`;

function MapWithLocations({ cntLocation, users }: MapProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
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
        {users.map(({ location, nickname }, idx) => {
          return (
            <MapMarker
              position={location}
              title={nickname}
              key={idx}
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 12, height: 18 },
              }}
              clickable={true}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen && (
                <div
                  style={{
                    fontSize: "12px",
                    padding: "5px",
                    color: "#000",
                  }}
                >
                  {nickname}
                </div>
              )}
            </MapMarker>
          );
        })}
      </Map>
    </MapContainer>
  );
}

export default MapWithLocations;
