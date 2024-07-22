import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import { Autocomplete, Paper, Typography, TextField } from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useParams } from "react-router-dom";

function BloodDonationEntry() {
  const [entries, setEntries] = useState([]);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { recipientId } = useParams();

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get(
        `/blood-donation?recipient=${recipientId}&startDate&endDate&minUnitsDonated=0&maxUnitsDonated`
      );
      try {
        console.log(res.data.data.entries);
        setEntries(res.data.data.entries);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleStartDate = (e) => {
    const d = JSON.stringify(e.target.value);
    setStartDate(d);
    console.log(d);
  };

  const handleEndDate = (e) => {
    const c = JSON.stringify(e.target.value);
    setEndDate(c);
    console.log(c);
  };

  // const handleDateChange = (e, setter) => {
  //   const date = e.target.value ? new Date(e.target.value).toISOString() : null;
  //   setter(date);
  //   filterEntries();
  // };

  const filterEntries = async () => {
    const response = await axiosInstance.get(
      `blood-donation?recipient&startDate=${startDate}&endDate=${endDate}&minUnitsDonated=0&maxUnitsDonated`
    );
    try {
      console.log(response.data.data);
      setEntries(response.data.data.entries);
    } catch (err) {
      console.log(err);
    }
  };

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
        <input type="date" onChange={(e) => handleStartDate(e)} />
        <input type="date" onChange={(e) => handleEndDate(e)} />
        <button onClick={filterEntries}>Filter</button>
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
              <h4 style={{ margin: "3px" }}>Name:{entry.recipient.fullName}</h4>
              <h5 style={{ margin: "3px" }}>
                Number:{entry.recipient.mobileNumber}
              </h5>
            </Paper>
          </li>
        ))}
      </ul>
      <BottomNav />
    </div>
  );
}

export default BloodDonationEntry;
