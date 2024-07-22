import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useParams } from "react-router-dom";
import { ExpandMore } from "@mui/icons-material";
function BloodDonationEntry() {
  const [entries, setEntries] = useState([]);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { recipientId } = useParams();

  useEffect(() => {
    if (recipientId.length > 15) {
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
    } else {
      (async () => {
        const res = await axiosInstance.get(
          `/blood-donation?recipient&startDate&endDate&minUnitsDonated=0&maxUnitsDonated`
        );
        try {
          console.log(res.data.data.entries);
          setEntries(res.data.data.entries);
        } catch (err) {
          console.log(err);
        }
      })();
    }
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
            {recipientId.length > 15 ? (
              <h2>{entry.recipient.fullName}</h2>
            ) : null}
            <Accordion
              elevation={5}
              sx={{
                padding: "10px 0px",
                margin: "20px auto",
                backgroundColor: "#FEF9F9",
              }}
            >
              <AccordionSummary
                sx={{
                  width: "100%",
                  "& .MuiAccordionSummary-content": {
                    display: "flex",
                    margin: "0",
                    alignItems: "center",
                  },
                }}
                expandIcon={<ExpandMore />}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {recipientId.length < 15 ? (
                    <h3>{entry.recipient.fullName}</h3>
                  ) : (
                    <h4 style={{ margin: "3px" }}>
                      Units Donated:{entry.unitsDonated}
                    </h4>
                  )}

                  <h5 style={{ margin: "3px" }}>
                    Donated On:{entry.organisation.name}
                  </h5>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {recipientId.length < 15 ? (
                  <h4 style={{ margin: "3px" }}>
                    Units Donated:{entry.unitsDonated}
                  </h4>
                ) : null}
                <h5 style={{ margin: "3px" }}>Donated On:{entry.donatedOn}</h5>
                <a href="{entry.formImage}" download="filename.jpg">
                  <img
                    style={{ width: "40vw" }}
                    src={entry.formImage}
                    alt="No Form Image Available"
                  />
                </a>
              </AccordionDetails>
            </Accordion>
          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
  );
}

export default BloodDonationEntry;
