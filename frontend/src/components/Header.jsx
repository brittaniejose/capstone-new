import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Header() {
  //   const { sections, title } = props;
  const sections = [
    { title: "Posts", page: "posts" },
    { title: "Locations", page: "locations" },
    { title: "Tips", page: "tips" },
    { title: "Tutorials", page: "tutorials" },
    { title: "Following", page: "following" },
  ];

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Button size="small">
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "inherit" }}>
            Profile
          </Link>
        </Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          sx={{ flex: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            SkateMates
          </Link>
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Button variant="outlined" size="small">
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "inherit",
              whiteSpace: "nowrap",
            }}>
            Sign up
          </Link>
        </Button>
        <Button variant="contained" size="small">
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "inherit",
              whiteSpace: "nowrap",
            }}>
            Login
          </Link>
        </Button>
        <Button variant="text" size="small">
          <Link
            to="/logout"
            style={{
              textDecoration: "none",
              color: "inherit",
              whiteSpace: "nowrap",
            }}>
            Logout
          </Link>
        </Button>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}>
        {sections.map((section) => (
          <Typography variant="body2">
            <Link
              style={{ color: "inherit", p: 1, flexShrink: 0 }}
              key={section.title}
              to={section.page}>
              {section.title}
            </Link>
          </Typography>
        ))}
      </Toolbar>
      <Outlet />
    </React.Fragment>
  );
}

// Header.propTypes = {
//   sections: PropTypes.arrayOf(
//     PropTypes.shape({
//       title: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//     }),
//   ).isRequired,
//   title: PropTypes.string.isRequired,
// };

export default Header;
