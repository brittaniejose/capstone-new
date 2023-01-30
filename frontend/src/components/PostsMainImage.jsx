import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function PostsMainImage() {
    const [src, setSrc] = useState("")
    useEffect(() => {
        const featuredImages = ["https://i.cbc.ca/1.6219816.1634841618!/fileImage/httpImage/roller-skates.jpg", "https://ttn-media.s3.amazonaws.com/2018/12/27171508/12.4_Features_WomensSkateboarding_SmithLuke-1WEB.jpg"]
        setSrc(selectRandomImage(featuredImages));
    }, [])
    function selectRandomImage(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    console.log(src, 'random image src')

  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: "50% 70%",
        backgroundImage: `url(${src})`,
      }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={src} alt={src} />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              See what skaters are talking about
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}