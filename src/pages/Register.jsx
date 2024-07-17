import React, { useContext, useEffect, useState } from "react";

import Header from "../components/Header";
import { TextField, Button } from "@mui/material";
import axiosInstance from "../axios/axios";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../contexts/authContext";

function Register() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNummber] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      navigate("/Blood-Donation-Form");
    }
  }, [navigate, setAuth]);

  const handleClick = () => {
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
      });
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
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            InputLabelProps={{
              style: {
                color: "#737373",
              },
            }}
            sx={{ width: "60vw", backgroundColor: "#E9E9F4" }}
          />

          <TextField
            id="mobileNumber"
            label="Mobile Number"
            type="number"
            variant="outlined"
            margin="normal"
            value={mobileNumber}
            onChange={(e) => {
              setMobileNummber(e.target.value);
            }}
            InputLabelProps={{
              style: {
                color: "#737373",
              },
            }}
            sx={{ width: "60vw", backgroundColor: "#E9E9F4" }}
          />

          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            InputLabelProps={{
              style: {
                color: "#737373",
              },
            }}
            sx={{ width: "60vw", backgroundColor: "#E9E9F4" }}
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
          already have an Account , <Link to="/Login">login</Link>
        </p>
      </div>
    </>
  );
}

export default Register;
