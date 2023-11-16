import React, { useEffect, useState } from "react";
import axios from "axios";
import { LocationProp } from "../routes/Locations";

function useLocation() {
  const [userLocation, setUserLocation] = useState<LocationProp>();
  useEffect(() => {
    // Send the user's location to the server with the user nickname
    const location = async () => {
      axios
        .get(
          `https://ipgeolocation.abstractapi.com/v1/?api_key=${
            import.meta.env.VITE_ABSTRACT_API_KEY
          }`
        )
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          setUserLocation({ lat: data.latitude, lng: data.longitude });
        });
    };
    location();
    console.log("User location arrived!");
  }, []);
  return { userLocation };
}

export default useLocation;
