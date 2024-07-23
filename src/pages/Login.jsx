import React, { useContext, useEffect, useState } from "react";
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

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useContext(authContext);
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      navigate("/Blood-Donation-Form");
    }
  }, []);

  const handleClick = () => {
    axiosInstance
      .post("/users/login", {
        mobileNumber,
        password,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.data.accessToken);
        const authData = localStorage.setItem("authData", response.data.data);
        navigate("/Blood-Donation-Form");
      })
      .catch((error) => {
        console.log(error);
        setErrMessage(error.response.data.message);
        setOpen(true);
      });
  };

  return (
    <>
      {" "}
      <Header />
      <div className="reg-id">
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            height: "60vh",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <h2>Login</h2>
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
                    <RemoveRedEyeIcon
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                    />
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
        </form>
        <div>
          <p>
            Don't have an Account? <Link to="/">sign up</Link>
          </p>
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
    </>
  );
}

export default Login;
