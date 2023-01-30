import './App.css';
import React, { useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HashRouter, Routes as Switch, Route } from "react-router-dom";
import { UserContext } from './Contexts';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './components/Header';
import Home from './components/Home';
import Posts from './components/Posts';
import SinglePost from './components/SinglePost';
import Signup from './components/Signup';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Profile from './components/Profile';
import Locations from './components/Locations';
import Tips from './components/Tips';
import Tutorials from './components/Tutorials';
import Following from './components/Following'

function App() {
  const theme = createTheme();
  const [following, setFollowing] = useState([]);
  const [followingFetched, setFollowingFetched] = useState(false);

  useEffect(() => {
    getFollowing();
  }, [followingFetched])

  const getContext = () => {
    if (localStorage.length > 0) {
      const userID = localStorage.getItem("userID");
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const displayName = localStorage.getItem("displayName");
  
      const user = {
        id: userID,
        username: username,
        displayName: displayName,
        following: [...following]
      };
      return user;
    }else {
      const user = null;
      return user;
    }
  } 
  const user = getContext();

  const getFollowing = async () => {
    const response = await fetch (`http://localhost:3000/follow/following/${user.id}`, {
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    });

    const resFollowing = await response.json();
    if (resFollowing.length > 0) {
      setFollowing([...resFollowing]);
      if (following) {
        console.log(following, 'users following')
        setFollowingFetched(true);
      }
    }
  };

  return (
    <UserContext.Provider value={user}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
      <HashRouter>
          <Switch>
            <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="/signup" element={<Signup />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/userProfile" element={<UserProfile />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/posts" element={<Posts />}/>
            <Route path="/post" element={<SinglePost />}/>
            <Route path="/locations" element={<Locations />}/>
            <Route path="/tips" element={<Tips />}/>
            <Route path="/tutorials" element={<Tutorials />}/>
            <Route path="/following" element={<Following />}/>
            </Route>
          </Switch>
      </HashRouter>
      </Container>
    </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;