import React, { useEffect, useState } from 'react'
import PostsMainImage from './PostsMainImage';
import FeaturedCard from './FeaturedCard';
import Alert from "@mui/material/Alert";
import Grid from '@mui/material/Grid';
import CreatePostBtn from './CreatePostBtn';
import CreatePost from './CreatePost';

function Tips() {
  const [serverError, setServerError] = useState('');
  const [postsFetched, setPostsFetched] = useState(false);
  const [posts, setPosts] = useState([]);
  const [resource, setResource] = useState('');
  const [open, setOpen] = useState(false);


  useEffect(() => {
    getPosts();
  }, [postsFetched]);

  const getPosts = async () => {
    const response = await fetch ('http://localhost:3000/posts/tips', {
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    });

    const resPosts = await response.json();
    console.log(resPosts, 'posts GET');

    if (resPosts.serverMessage) {
      setServerError(resPosts.serverMessage);
    } else {
      setPosts([...resPosts.posts]);
      setResource(resPosts.resource)
      if (posts) {
        console.log(posts, 'posts setState')
        console.log(resource, 'resource set state')
        setPostsFetched(true);
      } 
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <PostsMainImage />
      { serverError ? <Alert severity="error">{serverError}</Alert> : null }
      <CreatePostBtn handleClick={handleClick}/>
      { postsFetched ? (
        <Grid container spacing={4}>
        {posts.map(post => {
        return (
        <FeaturedCard data={post} key={post.id} resource={resource}/>
        )
      })}
      </Grid>
      ) : null}
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  )
}

export default Tips

