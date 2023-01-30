import React, { useEffect, useState } from 'react'
import PostsMainImage from './PostsMainImage';
import FeaturedCard from './FeaturedCard';
import Alert from "@mui/material/Alert";
import Grid from '@mui/material/Grid';

function Posts() {
  const [serverError, setServerError] = useState('');
  const [postsFetched, setPostsFetched] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, [postsFetched]);

  const getPosts = async () => {
    const response = await fetch ('http://localhost:3000/posts', {
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    });

    const resPosts = await response.json();
    console.log(resPosts, 'posts GET');

    if (resPosts.serverMessage) {
      setServerError(resPosts.serverMessage);
    } else {
      setPosts([...resPosts]);
      if (posts) {
        console.log(posts, 'posts setState')
        setPostsFetched(true);
      } 
    }
  };
  return (
    <div>
      <PostsMainImage />
      { serverError ? <Alert severity="error">{serverError}</Alert> : null }
      { postsFetched ? (
        <Grid container spacing={4}>
        {posts.map(post => {
        return (
        <FeaturedCard data={post} key={post.id}/>
        )
      })}
      </Grid>
      ) : null}
    </div>
  )
}

export default Posts
