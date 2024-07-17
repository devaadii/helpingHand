import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import AppBar from "@mui/material/AppBar";
import toggler from "../icons/image.png";
import { Height } from "@mui/icons-material";
function Header() {
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
          >
            <img style={{ width: "30px" }} src={toggler} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
