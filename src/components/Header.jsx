import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Popover, Button, Box } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import toggler from "../icons/image.png";
import { Height } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const auth = localStorage.getItem("authData");

  const handleClick = (event) => {
    if (auth) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {" "}
      <AppBar id="appbar" position="static">
        <Toolbar variant="dense">
          <Typography id="title" variant="h6" color="inherit" component="div">
            Helping Hands
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: "auto" }}
            onClick={handleClick}
          >
            <img style={{ width: "30px" }} src={toggler} />
          </IconButton>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box sx={{ p: 4 }}>
              <Typography>Choose Where you want to go</Typography>
              <div style={{ marginTop: "20px" }}>
                <NavLink
                  style={{
                    margin: "5px",
                    color: "#4285F4",
                    textDecoration: "none",
                  }}
                  to="/recipient-info"
                >
                  Recipient Info
                </NavLink>
                <NavLink
                  style={{
                    margin: "5px",
                    color: "#4285F4",
                    textDecoration: "none",
                  }}
                  to="/BloodDonation-entries/:recipientId"
                >
                  Blood Donation Entry
                </NavLink>
              </div>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
