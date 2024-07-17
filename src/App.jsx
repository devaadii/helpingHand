import { useContext, useState, useEffect } from "react";
import Register from "./pages/Register";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OtherHelp from "./pages/OtherHelp";
import BloodDonationForm from "./pages/BloodDonationForm";
import Login from "./pages/Login";
import Protected from "./pages/Protected";
import authContext from "./contexts/authContext";
import BloodDonationForm2 from "./pages/BloodDonationForm2";

function App() {
  const [count, setCount] = useState(0);
  const { auth, setAuth } = useContext(authContext);
  useEffect(() => {
    const authData = localStorage.getItem("authData");
    if (authData) {
      setAuth(authData);
    }
  }, [setAuth]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Protected />}>
            <Route
              path="/Blood-Donation-Form"
              element={<BloodDonationForm />}
            />
            <Route
              path="/Blood-Donation-Form2"
              element={<BloodDonationForm2 />}
            />
            <Route path="/Other-Help" element={<OtherHelp />} />
          </Route>
          <Route path="/" element={<Register />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
