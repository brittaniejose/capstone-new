import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Input from "@mui/material/Input";
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";

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

export default function EditPost({ open, setOpen, post, postID }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [media, setMedia] = useState(post.media);
  const [postSuccess, setPostSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      postID: postID,
      title,
      content,
      media,
    };

    const response = await fetch("http://localhost:3000/posts/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    const resPost = await response.json();
    console.log(resPost, "user response @ signup form ln 55");

    if (resPost.postError) {
      setServerError(resPost.postError);
    } else {
      console.log(resPost.message);
      setPostSuccess(resPost.message);
      setOpen(!open);
      window.location.reload();
    }
  };

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open}>
        <div style={{ padding: 10, cursor: 'pointer' }} onClick={handleClose}>
        <CancelIcon/>
        </div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Typography component="h1" variant="h5">
          Edit Post
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 3,
          }}
          onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column', margin: 'auto', pl: 3}}>
            <Grid item xs={12} md={10}>
              <TextField
                autoComplete="given-name"
                fullWidth
                name="title"
                required
                id="title"
                label="Title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={10}>
              <Input
                id="media"
                label="Media"
                name="media"
                autoComplete="media"
                type="file"
                onChange={(e) => setMedia(e.target.value)}
              />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, width: '25%', float: 'center'}}>
            Save
          </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Dialog>
  );
}
