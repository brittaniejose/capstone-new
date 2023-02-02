import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Alert from "@mui/material/Alert";
import Author from "./Author";
import Button from "@mui/material/Button";
import Comments from "./Comments";
import { useContext } from "react";
import { UserContext } from "../Contexts";
// import EditPost from "./EditPost";
import MapCard from "./MapCard";
import ImageCard from "./ImageCard";

export default function SingleLocation({ findFollowing, follow, followed, isLoaded }) {
  const locationID = localStorage.getItem("locationID");
  const resource = localStorage.getItem('resource');
  const [serverError, setServerError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [location, setLocation] = useState({});
  const [locationFetched, setLocationFetched] = useState(false);
  const [open, setOpen] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const navigate = useNavigate();
  const user = useContext(UserContext);


  useEffect(() => {
    getLocation();
  }, [locationFetched, editSuccess]);

  const getLocation = async () => {
    const response = await fetch(`http://localhost:3000/locations/${locationID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const resLocation = await response.json();
    console.log(resLocation, "location GET");

    if (resLocation.serverMessage) {
      setServerError(resLocation.serverMessage);
    } else {
        setLocation({ ...resLocation });
      if (location) {
        console.log(location, "location setState");
        console.log(location.coordinates, 'location coordinates')
        setLocationFetched(true);
      }
    }
  };

//   const handleClickedTag = () => {
//     navigate("/tips");
//   };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3000/locations/delete`, {
      method: "POST",
      body: JSON.stringify({ locationID }),
      headers: { "Content-Type": "application/json" },
    });
    const resDelete = await response.json();
    if (resDelete.serverMessage) {
      setServerError(resDelete.serverMessage);
    } else {
      console.log(resDelete);
      setDeleteSuccess(resDelete.message);
      navigate('/')
    }
  };

//   const handleEdit = () => {
//     setOpen(true)
//   };

  return (
    <Grid container spacing={5} sx={{ mt: 3 }}>
      <Grid item xs={12} md={12}>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      </Grid>
      {locationFetched ? (
        <React.Fragment>
          <Grid item xs={12} md={9} sx={{ py: 5 }}>
            <Grid container spacing={1} >
              <Grid item xs={9.5} md={9.5} sx={{ display: "flex" }}>
              <Typography variant="h4" gutterBottom sx={{ mr: 5 }}>
                {location.header}
              </Typography>
              </Grid>
              <Grid item xs={2.5} md={2.5}>
              <Typography sx={{ mt: 2, justifySelf: 'end' }}>
                {(location.createdAt = new Date(location.createdAt).toLocaleString("en-US"))}
              </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 5 }} />
            <Typography variant="p">{location.content}</Typography>
            <br />
            {location.User.id === user.id ? 
            <React.Fragment>
              <Button onClick={handleDelete}>Delete Location</Button>
              {/* <Button onClick={handleEdit}>Edit Location</Button>  */}
            </React.Fragment>
            : null }
          </Grid>
          <Author
            data={location}
            findFollowing={findFollowing}
            follow={follow}
            followed={followed}
          />
          <Comments data={location} resource={resource} />
          <MapCard isLoaded={isLoaded} coordinates={location.coordinates} name={location.name}/>
          {/* <EditPost open={open} setOpen={setOpen} location={post} postID={postID} /> */}
        </React.Fragment>
      ) : null}
    </Grid>
  );
}
