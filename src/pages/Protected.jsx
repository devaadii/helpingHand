import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import authContext from "../contexts/authContext";
function Protected() {
  const { auth, setAuth } = useContext(authContext);

  return auth ? <Outlet /> : <Navigate to="/Login" />;
}

export default Protected;
