import React, { useContext, useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OtherHelp() {
  const [timer, setTimer] = useState(5);
  const [memeUrl, setMemeUrl] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    setTimeout(() => {
      navigate("/Blood-Donation");
    }, [5000]);

    return () => clearInterval(intervalId);
  }, []);
  // useEffect(() => {
  //   const fetchMeme = async () => {
  //     const options = {
  //       method: "GET",
  //       url: "https://programming-memes-images.p.rapidapi.com/v1/memes",
  //       headers: {
  //         "x-rapidapi-key":
  //           "2af4d3052dmshb9292bc673faddcp10e1acjsn7e50405f2e18",
  //         "x-rapidapi-host": "programming-memes-images.p.rapidapi.com",
  //       },
  //     };

  //     try {
  //       const response = await axios.request(options);
  //       const randomIndex = Math.floor(Math.random() * response.data.length);
  //       setMemeUrl(response.data[randomIndex].image);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchMeme();
  // }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <Header />
      {/* <img
        style={{
          width: "60vw",
          border: "1px solid black",
          marginTop: "15px",
          "@media (minWidth: 1024px)": {
            width: "20vw",
          },
        }}
        src={memeUrl}
      /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "centre",
          background: "transaparent",
        }}
      >
        <h2>
          This Page is under development , redirecting to Form page in {timer}
        </h2>{" "}
      </div>
      <BottomNav />
    </div>
  );
}

export default OtherHelp;
