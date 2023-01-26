import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HashRouter, Routes as Switch, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Header from './components/Header';
import Home from './components/Home';
import Posts from './Posts';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Locations from './components/Locations';
import Tips from './components/Tips';
import Tutorials from './components/Tutorials';
import Following from './components/Following'

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
      <HashRouter>
          <Switch>
            <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="/signup" element={<Signup />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/posts" element={<Posts />}/>
            <Route path="/locations" element={<Locations />}/>
            <Route path="/tips" element={<Tips />}/>
            <Route path="/tutorials" element={<Tutorials />}/>
            <Route path="/following" element={<Following />}/>
            </Route>
          </Switch>
      </HashRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;

{/* <BrowserRouter>
<Routes>
  <Route path="/" element={<Header />}>
  <Route index element={<Signup />} />
  </Route>
</Routes>
</BrowserRouter> */}
