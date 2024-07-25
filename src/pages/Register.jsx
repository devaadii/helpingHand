import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import axiosInstance from "../axios/axios";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../contexts/authContext";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import backgroundImage from "./images/v915-techi-055-a.jpg";
import image from "./images/images.jpeg";
function Register() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useContext(authContext);
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const storedAuth = localStorage.getItem("token");
    if (storedAuth) {
      navigate("/Blood-Donation");
    }
  }, [navigate]);

  const handleClick = () => {
    if (!validateForm()) {
      return;
    }
    axiosInstance
      .post("/users/", { fullName, mobileNumber, password })
      .then((response) => {
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
      })
      .catch((error) => {
        setErrMessage(error.response?.data?.message || "An error occurred");
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const isMobileNumberValid = mobileNumber.length === 10;

  const validateForm = () => {
    if (!isMobileNumberValid) {
      setErrMessage("Mobile number must be 10 digits");
      return false;
    }
    return true;
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div
        className="curve"
        style={{ background: `url(${image})`, backgroundSize: "cover" }}
      ></div>
      <div className="reg-id">
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            height: "60vh",
            margin: 0,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "30px", margin: "20px 0" }}>Sign Up</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="fullName"
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputLabelProps={{ style: { color: "#737373" } }}
              sx={{
                width: "70vw",
                backgroundColor: "#FEF9F9",
                "@media (min-width: 1024px)": { width: "30vw" },
              }}
            />
            <TextField
              id="mobileNumber"
              label="Mobile Number"
              type="number"
              variant="outlined"
              margin="normal"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              error={!!mobileNumber && !isMobileNumberValid}
              helperText={
                !!mobileNumber && !isMobileNumberValid
                  ? "Mobile number must be 10 digits"
                  : ""
              }
              InputLabelProps={{ style: { color: "#737373" } }}
              sx={{
                width: "70vw",
                backgroundColor: "#FEF9F9",
                "@media (min-width: 1024px)": { width: "30vw" },
              }}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <VisibilityOffIcon
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <VisibilityIcon
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#737373" } }}
              sx={{
                width: "70vw",
                backgroundColor: "#FEF9F9",
                "@media (min-width: 1024px)": { width: "30vw" },
              }}
            />
            <Button
              variant="contained"
              sx={{ m: 2 }}
              onClick={handleClick}
              style={{ backgroundColor: "#C42421", width: "200px" }}
            >
              Register
            </Button>
          </div>
          <p>
            Already have an account? <Link to="/Login">Login</Link>
          </p>
        </form>

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

        {successMessage && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
}

export default Register;
