import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const [value, setValue] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/Blood-Donation-Form") {
      setValue("Blood-Donation-Form");
    } else if (location.pathname === "/Other-Help") {
      setValue("Other-Help");
    } else if (location.pathname === "/3") {
      setValue("3");
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`/${newValue}`);
  };

  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authData");
    navigate("/Login");
  };

  return (
    <div>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,

          width: "100vw",
        }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Blood Donation"
            value="Blood-Donation-Form"
            icon={<BloodtypeIcon />}
            sx={{
              borderTop:
                value === "Blood-Donation-Form" ? "2px solid black" : "none",
              "& .MuiSvgIcon-root": {
                color: value === "Blood-Donation-Form" ? "black" : "inherit",
              },
              "& .MuiBottomNavigationAction-label": {
                color: value === "Blood-Donation-Form" ? "black" : "inherit",
              },
            }}
          />
          <BottomNavigationAction
            label="Other"
            value="Other-Help"
            icon={<HelpIcon />}
            sx={{
              borderTop: value === "Other-Help" ? "2px solid black" : "none",
              "& .MuiSvgIcon-root": {
                color: value === "Other-Help" ? "black" : "inherit",
              },
              "& .MuiBottomNavigationAction-label": {
                color: value === "Other-Help" ? "black" : "inherit",
              },
            }}
          />
          <BottomNavigationAction
            label="Logout"
            value="3"
            onClick={handleClick}
            icon={<LogoutIcon />}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default BottomNav;
