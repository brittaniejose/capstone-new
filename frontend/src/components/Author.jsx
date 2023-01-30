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

export default function Author({data}) {
  const [followed, setFollowed] = useState(false);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const toProfile = () => {
    navigate('/profile');
  };
  console.log(user.following, "user is following")
  const isFollowing = user.following.includes(data.User.id);
  console.log(isFollowing, 'isFollowing boolean');
  
  const follow = async () => {
    const followObj = {
      followingID: data.User.id,

    }
    const response = await fetch("http://localhost:3000/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(followObj),
    });

    const resFollow = await response.json();
    console.log(resFollow, 'follow response');

    if (resFollow.message) {
      console.log(resFollow.message);
      setFollowed(true);
    }
  };

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
      <Button variant="contained" onClick={follow}>{followed ? 'Following' : 'Follow'}</Button>
      <Button size="small" onClick={toProfile}>See Profile</Button>
    </Paper>
  </Grid>
  )
}
