import React, { useEffect, useState } from 'react'
import LocationsMainImage from './LocationsMainImage';
import FeaturedCard from './FeaturedCard';
import Alert from "@mui/material/Alert";
import Grid from '@mui/material/Grid';

function Locations() {
  const [serverError, setServerError] = useState('');
  const [locationsFetched, setLocationsFetched] = useState(false);
  const [locations, setLocations] = useState([]);
  const [resource, setResource] = useState('');
  const [open, setOpen] = useState(false);


  useEffect(() => {
    getLocations();
  }, [locationsFetched]);

  const getLocations = async () => {
    const response = await fetch ('http://localhost:3000/locations', {
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    });

    const resLocations = await response.json();
    console.log(resLocations, 'locations GET');

    if (resLocations.serverMessage) {
      setServerError(resLocations.serverMessage);
    } else {
      setLocations([...resLocations.locations]);
      setResource(resLocations.resource)
      if (locations) {
        console.log(locations, 'locations setState')
        setLocationsFetched(true);
      } 
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div>
      <LocationsMainImage />
      { serverError ? <Alert severity="error">{serverError}</Alert> : null }
      {/* <CreatePostBtn handleClick={handleClick}/> */}
      { locationsFetched ? (
        <Grid container spacing={4}>
        {locations.map(location => {
        return (
        <FeaturedCard data={location} key={location.id} resource={resource}/>
        )
      })}
      </Grid>
      ) : null}
      {/* <CreatePost open={open} setOpen={setOpen}/> */}
    </div>
  )
}

export default Locations
