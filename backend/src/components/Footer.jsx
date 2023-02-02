import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link to="/" style={{ color: "inherit" }}>
        SkateMates
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Copyright />
      </Container>
    </Box>
  );
}


export default Footer;