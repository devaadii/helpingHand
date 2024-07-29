import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, TextField } from "@mui/material";
import Header from "../components/Header";
import axiosInstance from "../axios/axios";
import { useNavigate, Link } from "react-router-dom";
import authContext from "../contexts/authContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import image from "./images/images.jpeg";
import backgroundImage from "./images/v915-techi-055-a.jpg";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useContext(authContext);
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authData")) {
      navigate("/Blood-Donation");
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClick = () => {
    axiosInstance
      .post("/users/login", {
        mobileNumber,
        password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.data.accessToken);
        setAuth(JSON.stringify(response.data.data));
        const authData = localStorage.setItem("authData", response.data.data);
        navigate("/Blood-Donation");
      })
      .catch((error) => {
        setErrMessage(error.response.data.message);
        setOpen(true);
      });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      {" "}
      <div
        className="curve"
        style={{ background: `url(${image})`, backgroundSize: "cover" }}
      ></div>
      <div className="reg-id">
        <form
          style={{
            display: "flex",
            flexDirection: "column",

            justifyContent: "flex-start",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h2 style={{ fontSize: "30px", margin: " 0" }}>Login</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="mobileNumber"
              label="Mobile Number"
              variant="outlined"
              margin="normal"
              value={mobileNumber}
              type="number"
              InputLabelProps={{
                style: {
                  color: "#737373",
                },
              }}
              onChange={(e) => setMobileNumber(e.target.value)}
              sx={{
                width: "70vw",
                backgroundColor: "#FEF9F9",
                "@media (min-width: 1024px)": {
                  width: "30vw",
                },
              }}
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              InputLabelProps={{
                style: {
                  color: "#737373",
                },
              }}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                width: "70vw",
                backgroundColor: "#FEF9F9",
                "@media (min-width: 1024px)": {
                  width: "30vw",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <VisibilityOffIcon
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                        }}
                      />
                    ) : (
                      <VisibilityIcon
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                        }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />{" "}
          </div>
          <Button
            className="login-button"
            variant="contained"
            onClick={handleClick}
            style={{ backgroundColor: "#C42421" }}
          >
            Login
          </Button>
          <p>
            Don't have an Account? <Link to="/">sign up</Link>
          </p>
        </form>
        <div>
          {errMessage && (
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {errMessage}
              </Alert>
            </Snackbar>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
