import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from "@mui/material/Grid";


export default function ImageCard({media}) {
    useEffect(() => {
        console.log(media, 'media in image collage')
    }, [])
  return (
    <Grid item xs={12} md={4}>
    <Card sx={{ maxWidth: 800, mb: 10 }}>
        <CardHeader title='Photo'/>
        <CardMedia
        component="img"
        height="400px"
        image={media.url}
        alt={media.name}
      />
    </Card>
    </Grid>
  )
}