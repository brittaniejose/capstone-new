import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Alert from "@mui/material/Alert";
import PostAuthor from "./Author";
import Comments from "./Comments";

export default function SinglePost() {
  const postID = localStorage.getItem("postID");
  const [serverError, setServerError] = useState("");
  const [post, setPost] = useState({});
  const [tags, setTags] = useState([]);
  const [postFetched, setPostFetched] = useState(false);
  const [tagsFetched, setTagsFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPost();
  }, [postFetched, tagsFetched]);

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

  return (
    <Grid container spacing={5} sx={{ mt: 3 }}>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      {postFetched ? (
        <React.Fragment>
          <Grid item xs={12} md={9} sx={{ py: 5 }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h4" gutterBottom>
                {post.title}
              </Typography>
              {tagsFetched ? (
                <Badge
                  color="secondary"
                  badgeContent={tags[0].name}
                  sx={{ mt: 2.7, ml: 5, cursor: "pointer" }}
                  onClick={handleClickedTag}></Badge>
              ) : null}
            </div>
            <Divider sx={{ mb: 5 }} />
            <Typography variant="p">{post.content}</Typography>
          </Grid>
          <PostAuthor data={post}/>
          <Grid item xs={12} md={9} sx={{ py: 5 }}>
          <Divider sx={{ mb: 3 }} />
          <Comments data={post} />
          </Grid>
        </React.Fragment>
      ) : null}
    </Grid>
  );
}