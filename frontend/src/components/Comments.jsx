import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Like from "./Like";
import { useContext } from "react";
import { UserContext } from "../Contexts";
import { ListItemIcon } from "@mui/material";

function Comments({ data }) {
  const [comments, setComments] = useState([]);
  const [commentsFetched, setCommentsFetched] = useState(false);
  const [commentLikes, setCommentLikes] = useState([]);
  const [likesFetched, setLikesFetched] = useState(false);
  const [serverError, setServerError] = useState("");
  const user = useContext(UserContext);

  useEffect(() => {
    getComments();
    fetchCommentLikes();
  }, [commentsFetched, likesFetched]);

  const getComments = async () => {
    const response = await fetch(
      `http://localhost:3000/comments/post/${data.id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const resComments = await response.json();
    console.log(resComments, "posts GET");

    if (resComments.serverMessage) {
      console.log(resComments.serverMessage);
      setServerError(resComments.serverMessage);
    } else {
      setComments([...resComments.comments]);
      if (comments) {
        console.log(comments, "comments from setState");
        setCommentsFetched(true);
      }
    }
  };

  const fetchCommentLikes = async () => {
    const promises = comments.map(async (comment) => {
      const response = await fetch(`http://localhost:3000/like/for-comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.id, commentID: comment.id }),
      });
      const resLikes = await response.json();
      if (resLikes.serverMessage) {
        console.log(resLikes.serverMessage);
        setServerError(resLikes.serverMessage);
      } else {
        console.log(resLikes, "likes obj for each comment");
        return resLikes;
      }
    });

    const commentLikesArray = await Promise.all(promises);
    setCommentLikes([...commentLikesArray]);
    setTimeout(() => {
      setLikesFetched(true);
    }, 1000);
  };

  return (
    <React.Fragment>
      {commentsFetched ? (
        <Grid item xs={12} md={9} sx={{ py: 5 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Comments
          </Typography>
          <Divider sx={{ mb: 0 }} />
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {comments.map((comment, index) => {
              return (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start" key={comment.id}>
                    <ListItemAvatar>
                      <Avatar
                        alt={comment.User.username}
                        src={
                          comment.User.media
                            ? comment.User.media[0]
                            : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png"
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}>
                          <Typography>{comment.User.displayName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {
                              (comment.createdAt = new Date(
                                comment.createdAt
                              ).toLocaleString("en-US"))
                            }
                          </Typography>
                        </div>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary">
                            {comment.User.username}
                          </Typography>
                          {` — ${comment.content}`}
                        </React.Fragment>
                      }></ListItemText>
                  </ListItem>
                  {likesFetched ? (
                    <div>
                      <ListItem key={comment.id}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {commentLikes[index].likesCount}{" "}
                              {commentLikes[index].likesCount === 0
                                ? "likes"
                                : commentLikes[index].likesCount > 1
                                ? "likes"
                                : "like"}
                            </Typography>
                          }></ListItemText>
                      <Like alreadyLiked={commentLikes[index].liked} resourceType='comment' resourceID={comment.id} />
                      </ListItem>
                    </div>
                  ) : null}
                  <Divider sx={{ mb: 0 }} />
                </React.Fragment>
              );
            })}
          </List>
        </Grid>
      ) : (
        <Typography>Be the first to comment!</Typography>
      )}
    </React.Fragment>
  );
}
export default Comments;
