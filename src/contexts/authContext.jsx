import React, { createContext, useState } from "react";

const authContext = createContext();

export default authContext;

export const AuthProvider = (props) => {
  const [auth, setAuth] = useState("");
  return (
    <authContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </authContext.Provider>
  );
};
