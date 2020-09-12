import React from "react";
import MapViewDirections from "react-native-maps-directions";

const Directions = ({ destination, origin}) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    apikey="AIzaSyACw6E2f6dC6qs9Iq0nadFoRmvKv73benE"
    strokeWidth={4}
    strokeColor="#22a7f0"
  />
);

export default Directions;