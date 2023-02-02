import React, { useEffect, useState } from "react";
import FollowingMainImage from "./FollowingMainImage";
import FeaturedCard from "./FeaturedCard";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import ContentToggle from "./ContentToggle";
import { useContext } from "react";
import { UserContext } from "../Contexts";

function Following() {
  const [serverError, setServerError] = useState("");
  const [postsFetched, setPostsFetched] = useState(false);
  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [postResource, setPostResource] = useState("");
  const [locationResource, setLocationResource] = useState("");
  const [changeContent, setChangeContent] = useState(false);
  const [contentType, setContentType] = useState("");
  const [open, setOpen] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    getPosts();
    console.log(contentType, 'content type in following comp')
  }, [postsFetched]);


  const getPosts = async () => {
    const response = await fetch(
      `http://localhost:3000/follow/content/${user.id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const resPosts = await response.json();
    console.log(resPosts, "posts GET");

    if (resPosts.serverMessage) {
      setServerError(resPosts.serverMessage);
    } else {
      setPosts([...resPosts.posts.posts]);
      setPostResource(resPosts.posts.resource);
      setLocations([...resPosts.locations.locations]);
      setLocationResource(resPosts.locations.resource);
      if (posts || locations) {
        console.log(posts, "posts from setState");
        console.log(locations, 'locations from set state')
        console.log(postResource, "postResource set state");
        console.log(locationResource, "locationResource");
        setPostsFetched(true);
      }
    }
  };

  return (
    <div>
      <FollowingMainImage />
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      <ContentToggle
        changeContent={changeContent}
        setChangeContent={setChangeContent}
      />
      {(postsFetched && changeContent === false) ? (
        <Grid container spacing={4}>
          {posts.map((post) => {
            return (
              <FeaturedCard data={post} key={post.id} resource={postResource} />
            );
          })}
        </Grid>
      ) : null}
      {(postsFetched && changeContent === true) ? (
        <Grid container spacing={4}>
          {locations.map((location) => {
            return (
              <FeaturedCard
                data={location}
                key={location.id}
                resource={locationResource}
              />
            );
          })}
        </Grid>
      ) : null}
    </div>
  );
}

export default Following;
