import React, { useState, useEffect } from 'react'
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../Contexts';

export default function Author({data, findFollowing, follow, followed}) {
  const user = useContext(UserContext);
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    findFollowing(data.User.id);
    checkIfUser();
  }, [followed, isUser]);

  const toProfile = () => {
    navigate('/profile');
  };

  const checkIfUser = () => {
    console.log(data.User.id, 'post userID');
    console.log(user.id, 'logged in userID author comp')
    if (data.User.id === user.id) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
    console.log(isUser, 'isUser boolean')
  }

  return (
    <Grid item xs={12} md={3}>
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "grey.200",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <Typography variant="h6">Author</Typography>
      <Divider sx={{ mb: 2 }} />
      <Avatar
        alt={data.User.username}
        src={data.User.media ? data.User.media[0] : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png"}
      />
      <Typography>{data.User.displayName}</Typography>
      <Typography>{data.User.username}</Typography>
      { !isUser ? (
      <Button variant="contained" size="small" onClick={() => follow(data.User.id)}>{followed ? 'Following' : 'Follow'}</Button> ) : null }
      <Button size="small" onClick={toProfile}>{isUser ? "Your Profile" : "See Profile" }</Button>
    </Paper>
  </Grid>
  )
}
