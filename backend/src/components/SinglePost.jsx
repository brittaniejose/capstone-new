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
import EditPost from "./EditPost";
import ImageCard from "./ImageCard";

export default function SinglePost({ findFollowing, follow, followed }) {
  const postID = localStorage.getItem("postID");
  const resource = localStorage.getItem('resource');
  const [serverError, setServerError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [post, setPost] = useState({});
  const [tags, setTags] = useState([]);
  const [postFetched, setPostFetched] = useState(false);
  const [tagsFetched, setTagsFetched] = useState(false);
  const [open, setOpen] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const navigate = useNavigate();
  const user = useContext(UserContext);


  useEffect(() => {
    getPost();
  }, [postFetched, tagsFetched, editSuccess]);

  const getPost = async () => {
    const response = await fetch(`http://localhost:3000/posts/${postID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const resPost = await response.json();
    console.log(resPost, "posts GET");

    if (resPost.serverMessage) {
      setServerError(resPost.serverMessage);
    } else {
      setPost({ ...resPost });
      if (resPost.Tags.length > 0) {
        setTags([...resPost.Tags]);
        setTagsFetched(true);
      }
      if (post) {
        console.log(post, "post setState");
        setPostFetched(true);
      }
    }
  };

  const handleClickedTag = () => {
    navigate("/tips");
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3000/posts/delete`, {
      method: "POST",
      body: JSON.stringify({ postID }),
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

  const handleEdit = () => {
    setOpen(true)
  };

  return (
    <Grid container spacing={5} sx={{ mt: 3 }}>
      <Grid item xs={12} md={12}>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      </Grid>
      {postFetched ? (
        <React.Fragment>
          <Grid item xs={12} md={9} sx={{ py: 5 }}>
            <Grid container spacing={1} >
              <Grid item xs={9.5} md={9.5} sx={{ display: "flex" }}>
              <Typography variant="h4" gutterBottom sx={{ mr: 5 }}>
                {post.title}
              </Typography>
              {tagsFetched ? (
                <Badge
                  color="secondary"
                  badgeContent={tags[0].name}
                  sx={{ mt: 2.7, cursor: "pointer" }}
                  onClick={handleClickedTag}></Badge>
              ) : null}
              </Grid>
              <Grid item xs={2.5} md={2.5}>
              <Typography sx={{ mt: 2, justifySelf: 'end' }}>
                {(post.createdAt = new Date(post.createdAt).toLocaleString("en-US"))}
              </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 5 }} />
            <Typography variant="p">{post.content}</Typography>
            <br />
            {post.User.id === user.id ? 
            <React.Fragment>
              <Button onClick={handleDelete}>Delete Post</Button>
              <Button onClick={handleEdit}>Edit Post</Button> 
            </React.Fragment>
            : null }
          </Grid>
          <Author
            data={post}
            findFollowing={findFollowing}
            follow={follow}
            followed={followed}
          />
          <Comments data={post} resource={resource} />
          { post.media.length > 0 ? (
          <ImageCard media={post.media[0]}/>
          ): null }
          <EditPost open={open} setOpen={setOpen} post={post} postID={postID} />
        </React.Fragment>
      ) : null}
    </Grid>
  );
}
