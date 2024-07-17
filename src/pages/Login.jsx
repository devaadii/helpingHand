import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import Header from "../components/Header";
import axiosInstance from "../axios/axios";
import { useNavigate, Link } from "react-router-dom";
import authContext from "../contexts/authContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useContext(authContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      navigate("/Blood-Donation-Form");
    }
    // Have to remove this code
    // return () => {
    //   localStorage.removeItem("auth");
    // };
    //
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
        setMessage(error.response.data.message);
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
          <div>
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
              sx={{ width: "60vw", backgroundColor: "#E9E9F4" }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              InputLabelProps={{
                style: {
                  color: "#737373",
                },
              }}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: "60vw", backgroundColor: "#E9E9F4" }}
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
            Don't have an Account? <Link to="/">signup</Link>
          </p>
          {{ message } && <p> {message}</p>}
        </div>
      </div>
    </>
  );
}

export default Login;
