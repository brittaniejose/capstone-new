import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

const setLocalStorageItems = (items) => {
    console.log('setting items');
    for (let key in items) {
        localStorage.setItem(key, items[key]);
    }
}

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link to="/" style={{ color: "inherit" }}>
        SkateMates
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const existingUser = {
        usernameOrEmail,
        password,
      };
  
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existingUser),
      });
  
      const resUser = await response.json();
      console.log(resUser, "user response @ login form ln 52");
  
      if (resUser.errorMsg) {
        setLoginError(resUser.errorMsg);
      } else {
        setLocalStorageItems({
            token: resUser.token,
            userID: resUser.user.id,
            username: resUser.user.username,
            displayName: resUser.user.displayName
        });
        console.log('login success')
        window.location.href = '/'
      }
    };
  
    return (
      <div>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          {loginError ? <Alert severity="error">{loginError}</Alert> : null}
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 3 }}
            onSubmit={(e) => handleSubmit(e)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="usernameOrEmail"
                  label="Username or Email"
                  name="usernameOrEmail"
                  autoComplete="username or email"
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="body2" sx={{ marginBottom: "10px"}}>
                  <Link to="/login" style={{ color: "inherit" }}>
                    Already have an account? Login
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </div>
    )
}

export default Login
