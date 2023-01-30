import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";

export default function FeaturedCard({data}) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('link clicked')
    localStorage.setItem('postID', data.id);
    navigate('/post');
  }

    return (
      <Grid item xs={12} md={6}>
          <Card sx={{ display: 'flex' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                {data.title ? data.title : data.header}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {data.User.username}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {data.createdAt = new Date(data.createdAt).toLocaleString("en-US")}
              </Typography>
              <Typography variant="subtitle1" paragraph>
              {data.content.length > 40 ? data.content.substr(0, 40) + "..." : data.content}
              </Typography>
              <Button size="small" onClick={handleClick}>
                See full post
              </Button>
            </CardContent>
            { data.media ? 
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
              image={data.media[0]}
              alt={data.media[0]}
            /> : null }
          </Card>
      </Grid>
    );
  }