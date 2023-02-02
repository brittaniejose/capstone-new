import './App.css';
import React, { useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HashRouter, Routes as Switch, Route, useNavigate } from "react-router-dom";
import { UserContext } from './Contexts';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './components/Header';
import Home from './components/Home';
import Posts from './components/Posts';
import SinglePost from './components/SinglePost';
import SingleLocation from './components/SingleLocation';
import Signup from './components/Signup';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Profile from './components/Profile';
import Locations from './components/Locations';
import Tips from './components/Tips';
import Tutorials from './components/Tutorials';
import Following from './components/Following';
import { useLoadScript } from "@react-google-maps/api";


function App() {
  const theme = createTheme();
  const [following, setFollowing] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [followingFetched, setFollowingFetched] = useState(false);
  const [user, setUser] = useState(null);

  const libraries = ["places"]
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDlHRPWLON6plruqrryhZbJoUHFZcJEc-w", libraries: libraries,
  })


  useEffect(() => {
    getContext().then(()=>{if(user){getFollowing()}});
  }, [])

  const getContext = () => {
    return new Promise(() => {
      if (localStorage.length > 0) {
        const userID = localStorage.getItem("userID");
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const displayName = localStorage.getItem("displayName");
    
        const user = {
          id: Number(userID),
          username: username,
          displayName: displayName,
          following: [...following]
        };
        setUser(user)
      } else {
        setUser(null)
      }
    });
  } 
      
  // const user = getContext().then(() => { 
  //   if(user){
  //     getFollowing()
  //   }
  // });

  
  
  const getFollowing = async () => {
    console.log(user, 'user get follow');

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

  const findFollowing = (followingID) => {
    if (following.find(f => f.id === followingID)) {
      setFollowed(true);
    }
  }

  const follow = async (followingID) => {
    const followObj = {
      followingID: followingID,
      userID: user.id
    }
    const response = await fetch("http://localhost:3000/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(followObj),
    });

    const resFollow = await response.json();

    if (resFollow.message.includes('Followed')) {
      console.log(resFollow.message);
      setFollowed(true);
    } else {
      setFollowed(false);
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
            <Route path="/post" element={<SinglePost findFollowing={findFollowing} follow={follow} followed={followed}/>}/>
            <Route path="/location" element={<SingleLocation findFollowing={findFollowing} follow={follow} followed={followed} isLoaded={isLoaded}/>}/>
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