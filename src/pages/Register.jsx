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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function Register() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { auth, setAuth } = useContext(authContext);
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      navigate("/Blood-Donation-Form");
    }
  }, [navigate, setAuth]);

  const handleClick = () => {
    if (!validateForm()) {
      return;
    }
    axiosInstance
      .post("/users/", {
        fullName,
        mobileNumber,
        password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/Login");
      })
      .catch((error) => {
        console.log(error);
        setErrMessage(error.response.data.message);
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
    <>
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
          <h2>Sign Up</h2>
          <TextField
            id="fullName"
            label="Full Name"
            variant="outlined"
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            InputLabelProps={{
              style: { color: "#737373" },
            }}
            sx={{ width: "60vw", backgroundColor: "#FEF9F9" }}
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
            InputLabelProps={{
              style: { color: "#737373" },
            }}
            sx={{ width: "60vw", backgroundColor: "#FEF9F9" }}
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
                  <RemoveRedEyeIcon
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#737373" },
            }}
            sx={{ width: "60vw", backgroundColor: "#FEF9F9" }}
          />

          <Button
            className="login-button"
            variant="contained"
            margin="normal"
            onClick={handleClick}
            style={{ backgroundColor: "#C42421" }}
          >
            Register
          </Button>
        </form>
        <p>
          Already have an account? <Link to="/Login">Login</Link>
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
    </>
  );
}

export default Register;
