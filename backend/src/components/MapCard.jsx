import React, { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

function Map({isLoaded, coordinates}) {
  useEffect(() => {
    console.log(coordinates, 'coordinates')
  }, [coordinates]);

  // // stops map from recentering itself on each re-render
  const center = useMemo(
    () => ({ lat: coordinates.lat, lng: coordinates.lng }),
    [coordinates]
  );
  return (
    <div>     
      {coordinates && (
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container">
          <Marker position={{ lat: coordinates.lat, lng: coordinates.lng }} />
        </GoogleMap>
      )}
    </div>
  )
}




function MapCard({name, coordinates}) {
  return (
        <Grid item xs={12} md={4}>
          <Card sx={{ maxWidth: '75vh', mb: 10 }}>
            <CardHeader title={`Location: ${name}`} />
            <CardMedia
              height="300px"
              alt={name}
            ><Map coordinates={coordinates}/>
            </CardMedia>
          </Card>
        </Grid>
  );
}

export default MapCard;
