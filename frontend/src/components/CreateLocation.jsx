import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import { UserContext } from "../Contexts";
import { FormControl, InputLabel, Input } from "@mui/material";
import {Divider} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CancelIcon from "@mui/icons-material/Cancel";
import { Menu, MenuItem } from "@mui/material";

import PlacesAutoComplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link to="/" style={{ color: "inherit" }}>
        SkateMates
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function CreateLocation({ open, setOpen }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [address, setAddress] = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const [tag, setTag] = useState("");
  const user = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = false;

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     openMenu = true;
//     console.log(openMenu, 'open Menu handle click');
//   };
//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//     openMenu = false;
//     console.log(openMenu, 'open menu handle close')
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(tag, "tag in handle submit");

    const location = {
      content,
      coordinates: coordinates,
      name: address,
      displayName: user.displayName,
      userID: user.id,
    };

    const response = await fetch("http://localhost:3000/locations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });

    const resLocation = await response.json();
    console.log(resLocation, "location response @ create location");

    if (resLocation.postError) {
      setServerError(resLocation.postError);
    } else {
      console.log("location created");
      setPostSuccess(resLocation.message);
      setOpen(!open);
      window.location.reload();
    }
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    console.log(results, 'results')
    const latLng = await getLatLng(results[0]);
    console.log(latLng, 'latlng')
    setCoordinates(latLng);
    setAddress(value);
    console.log(coordinates, 'coordinate state');
    console.log(address);
  };
  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open}>
      <div style={{ padding: 10, cursor: "pointer" }} onClick={handleClose}>
        <CancelIcon />
      </div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "500px",
        }}>
        {serverError ? <Alert severity="error">{serverError}</Alert> : null}
        {postSuccess ? <Alert severity="success">{postSuccess}</Alert> : null}
        <Typography component="h1" variant="h5">
          Create Location
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 3,
            width: "400px",
          }}
          onSubmit={(e) => handleSubmit(e)}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              pl: 3,
            }}>
            <Grid item xs={12} md={10}>
              <TextField
                required
                fullWidth
                multiline
                rows={8}
                id="content"
                label="Content"
                name="content"
                autoComplete="content"
                onChange={(e) => setContent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={10}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                <PlacesAutoComplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleSelect}
                  id="locInput">
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <TextField
                        {...getInputProps({
                          placeholder: "Search a location",
                          autoComplete: "on",
                        })}
                        fullWidth
                        label="Search a Location"
                      />
                        <List>
                          {suggestions.map((suggestion) => {
                            return (
                            <div key={suggestion.placeId}>
                              <ListItem
                                disablePadding
                              
                                sx={{cursor: 'pointer'}}>
                                <ListItemText
                                  primary={suggestion.description}
                              
                                />
                              </ListItem>
                              <Divider sx={{ mb: 0 }} />
                            </div>
                            );
                          })}
                        </List>
                    </div>
                  )}
                </PlacesAutoComplete>
                <Typography variant='body2'>Selected Location: {address}</Typography>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: "25%", float: "center" }}>
                  Create
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Dialog>
  );
}
