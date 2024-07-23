import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useParams } from "react-router-dom";
import { ExpandMore } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

function BloodDonationEntry() {
  const [entries, setEntries] = useState([]);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { recipientId } = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  useEffect(() => {
    if (startDate || endDate) {
    }
  }, [setStartDate, setEndDate]);

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
        className="form"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "22px",
            padding: "0 2px",
            fontStyle: "italic",
          }}
        >
          Blood Donation Entries
        </h3>
        {/* <div style={{ display: "flex" }}> */}

        <IconButton
          edge="start"
          color="inherit"
          sx={{ ml: "auto" }}
          onClick={handleClick}
        >
          <FilterAltIcon sx={{ margin: "auto 10px" }} />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2, display: "flex", border: "1px solid black" }}>
            {" "}
            <div>
              <label htmlFor="start-date">Start Date </label>
              <input
                style={{ margin: "auto 5px" }}
                type="date"
                onChange={(e) => handleStartDate(e)}
              />
            </div>
            <div>
              {" "}
              <label htmlFor="end-date:">End Date</label>
              <input type="date" onChange={(e) => handleEndDate(e)} />
            </div>
            <Button onClick={filterEntries}>Filter</Button>
          </Typography>
        </Popover>

        {/* </div> */}
      </div>
      <hr style={{ margin: 0 }}></hr>

      <ul
        style={{
          listStyle: "none",
          display: "contents",
        }}
      >
        {entries.map((entry, index) => (
          <li key={entry._id}>
            {(index === 0) & (recipientId.length > 15) ? (
              <h2>{entry.recipient.fullName}</h2>
            ) : null}
            <Accordion
              elevation={5}
              square="false"
              sx={{
                border: "0.5px solid grey",
                borderRadius: "20px",
                padding: "10px 0px",
                margin: "20px auto",
              }}
            >
              <AccordionSummary
                sx={{
                  height: "10vh",
                  paddingTop: 0,
                  width: "100%",
                  "& .MuiAccordionSummary-content": {
                    display: "flex",
                    margin: "0",
                    alignItems: "center",
                  },
                }}
                expandIcon={<ExpandMore className="svg_icons" />}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {recipientId.length < 15 ? (
                    <h3 style={{ margin: "0" }}>{entry.recipient.fullName}</h3>
                  ) : (
                    <h4 style={{ margin: 0 }}>
                      Units Donated: {entry.unitsDonated}
                    </h4>
                  )}

                  <h4 style={{ margin: "0px" }}>
                    Donated On: {entry.organisation.name}
                  </h4>
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: "19px" }}
              >
                {recipientId.length < 15 ? (
                  <h4 style={{ margin: 0 }}>
                    Units Donated: {entry.unitsDonated}
                  </h4>
                ) : null}
                <h4 style={{ margin: 0 }}>Donated On: {entry.donatedOn}</h4>

                {entry.formImage ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <img
                      style={{ width: "40vw", border: "1px solid #AB6B69" }}
                      src={entry.formImage}
                      alt="No Form Image Available"
                    />
                    <a href="{entry.formImage}" download="filename.jpg">
                      <Button
                        size="small"
                        sx={{
                          color: "black",
                          border: "0.1px solid black",
                        }}
                      >
                        Download Image
                      </Button>
                    </a>
                  </div>
                ) : null}
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
