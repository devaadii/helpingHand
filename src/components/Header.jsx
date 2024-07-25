import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Popover, Button, Box } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import toggler from "../icons/image.png";
import { Height } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import EditNoteIcon from "@mui/icons-material/EditNote";
function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const auth = localStorage.getItem("token");

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
            <Box sx={{ p: 4, border: "1px solid black" }}>
              <Typography variant="h6">Choose Where you want to go?</Typography>
              <hr />
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",

                  gap: "20px",
                }}
              >
                {" "}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BookIcon />
                  <NavLink
                    style={{
                      margin: "5px",
                      color: "black",
                      textDecoration: "none",
                    }}
                    to="/recipient-info"
                  >
                    Recipient Info
                  </NavLink>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <EditNoteIcon />
                  <NavLink
                    style={{
                      margin: "5px",
                      color: "black",
                      textDecoration: "none",
                    }}
                    to="/BloodDonation-entries/"
                  >
                    Blood Donation Entry
                  </NavLink>
                </div>
              </div>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
