import * as React from "react";
import { useContext } from 'react';
import { UserContext } from '../Contexts';
import { Link } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";

export default function BasicMenu() {
    const user = useContext(UserContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const logout = () => {
      localStorage.clear();
      console.log('logged out');
      window.location.href = '/'
    }
  
    return (
      <div>
        <Button
          id="basic-button"
          size="small"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {user.displayName}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>
          <Link
            to="/userProfile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Profile
            </Link>
            </MenuItem>
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }