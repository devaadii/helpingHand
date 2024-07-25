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
import RecipientInfo from "./pages/RecipientInfo";
import BloodDonationEntry from "./pages/BloodDonationEntry";
import Fourzerofour from "./pages/Fourzerofour";

function App() {
  const [count, setCount] = useState(0);
  const { auth, setAuth } = useContext(authContext);
  useEffect(() => {
    const authData = localStorage.getItem("token");
    if (authData) {
      setAuth(authData);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Protected />}>
            <Route path="/Blood-Donation" element={<BloodDonationForm />} />

            <Route path="/Other-Help" element={<OtherHelp />} />

            <Route path="/recipient-info" element={<RecipientInfo />} />
            <Route
              path="/BloodDonation-entries/"
              element={<BloodDonationEntry />}
            />
            <Route
              path="/BloodDonation-entries/:recipientId"
              element={<BloodDonationEntry />}
            />
          </Route>
          <Route path="/" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/*" element={<Fourzerofour />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
