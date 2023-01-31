import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useContext } from "react";
import { UserContext } from "../Contexts";
import { ListItemButton, ListItemIcon, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function Like({ resourceID, resourceType, alreadyLiked }) {
  const [liked, setLiked] = useState(false);

  const user = useContext(UserContext);

  useEffect(() => {
    checkExisting();
  }, [liked]);

  const checkExisting = () => {
    if (alreadyLiked !== false) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const handleLike = async () => {
    const routeType =
      resourceType === "post"
        ? "/post"
        : resourceType === "comment"
        ? "/comment"
        : "/location";
    const response = await fetch(`http://localhost:3000/like${routeType}`, {
      method: "POST",
      body: JSON.stringify({ userID: user.id, resourceID }),
      headers: { "Content-Type": "application/json" },
    });
    const resLike = await response.json();
    console.log(resLike, "like response");
    if (resLike.message === "Like Removed") {
      setLiked(false);
    } else {
      setLiked(true);
    }
  };

  return (
    <div onClick={handleLike} style={{ cursor: "pointer" }}>
      <ListItemIcon>
        {liked ? (
          <React.Fragment>
            <FavoriteIcon />
            <ListItemText secondary="Unlike" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FavoriteBorderIcon />
            <ListItemText secondary="Like" />
          </React.Fragment>
        )}
      </ListItemIcon>
    </div>
  );
}
