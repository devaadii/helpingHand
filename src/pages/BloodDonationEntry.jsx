import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import { Autocomplete, Paper, Typography, TextField } from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

function BloodDonationEntry() {
  const [entries, setEntries] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get("/blood-donation");
      try {
        setEntries(res.data.data.entries);
        console.log(res.data.data.entries);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const response = await axiosInstance.get(
  //       `/recipients?search=${entries.recipient}`
  //     );
  //     try {
  //       console.log(response);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })();
  // }, []);

  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "25px",
            width: "50vw",
            fontStyle: "italic",
            fontWeight: "900",
          }}
        >
          Blood Donation Entries
        </h3>
        <Autocomplete
          freeSolo
          id="recipients"
          options={options}
          //   filterOptions={(x) => x}
          sx={{ width: "30vw" }}
          renderInput={(params) => (
            <TextField {...params} label="Search" variant="outlined" />
          )}
        />
      </div>
      <hr></hr>
      <ul
        style={{
          listStyle: "none",
          display: "contents",
        }}
      >
        {entries.map((entry) => (
          <li key={entry._id}>
            <Paper
              elevation={5}
              sx={{ padding: "10px 0px", margin: "20px auto" }}
            >
              <h4 style={{ margin: "3px" }}>Name:{entry.recipient}</h4>
              <h5 style={{ margin: "3px" }}>Number:{entry.unitsDonated}</h5>
            </Paper>
          </li>
        ))}
      </ul>
      <BottomNav />
    </div>
  );
}

export default BloodDonationEntry;
