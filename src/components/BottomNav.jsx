import React, { useState, useEffect, useContext } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import authContext from "../contexts/authContext";

function BottomNav() {
  const [value, setValue] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(authContext);

  useEffect(() => {
    if (location.pathname === "/Blood-Donation") {
      setValue("Blood-Donation");
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
    setAuth("");
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
          height: "8vh",
        }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Blood Donation"
            value="Blood-Donation"
            icon={<BloodtypeIcon />}
            sx={{
              borderTop:
                value === "Blood-Donation" ? "2px solid black" : "none",
              "& .MuiSvgIcon-root": {
                color: value === "Blood-Donation" ? "black" : "inherit",
              },
              "& .MuiBottomNavigationAction-label": {
                color: value === "Blood-Donation" ? "black" : "inherit",
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
            onClick={handleClick}
            icon={<LogoutIcon />}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default BottomNav;
