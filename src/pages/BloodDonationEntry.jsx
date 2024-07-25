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
  Divider,
  TextField,
} from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useParams } from "react-router-dom";
import { ExpandMore, LocationOn } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import background from "./images/v915-techi-055-a.jpg";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";

function BloodDonationEntry() {
  const [entries, setEntries] = useState([]);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { recipientId } = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);

  console.log("recipientId: ", recipientId);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (recipientId?.length > 15) {
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
    if (startDate && endDate) {
      const response = await axiosInstance.get(
        `blood-donation?recipient&startDate=${startDate}&endDate=${endDate}&minUnitsDonated=0&maxUnitsDonated`
      );
      try {
        console.log(response.data.data);
        setEntries(response.data.data.entries);
      } catch (err) {
        console.log(err);
      }
    } else if (startDate) {
      const response = await axiosInstance.get(
        `blood-donation?recipient&startDate=${startDate}&endDate&minUnitsDonated=0&maxUnitsDonated`
      );
      try {
        console.log(response.data.data);
        setEntries(response.data.data.entries);
      } catch (err) {
        console.log(err);
      }
    } else if (endDate) {
      const response = await axiosInstance.get(
        `blood-donation?recipient&startDate=${startDate}&endDate&minUnitsDonated=0&maxUnitsDonated`
      );
      try {
        console.log(response.data.data);
        setEntries(response.data.data.entries);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("error");
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
        <Typography variant="h6" fontWeight={600} sx={{ py: 2, ml: 1.5 }}>
          Blood Donation Entries
        </Typography>
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
          <Typography
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              border: "1px solid black",
            }}
          >
            {" "}
            <div>
              <TextField
                type="date"
                label="Start-Date"
                onChange={(e) => handleStartDate(e)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              {" "}
              <TextField
                label="End-Date"
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                onChange={(e) => handleEndDate(e)}
              />
            </div>
            <Button onClick={filterEntries}>Filter</Button>
          </Typography>
        </Popover>

        {/* </div> */}
      </div>
      <Divider variant="middle" />

      {/* <ul
        style={{
          listStyle: "none",
          display: "contents",
        }}
      > */}
      {entries.map((entry, index) => {
        return (
          <>
            {(index === 0) & (recipientId?.length > 15) ? (
              <h2>{entry.recipient.fullName}</h2>
            ) : null}
            <Accordion elevation={5} sx={{ my: 2 }} key={entry._id}>
              <AccordionSummary
                expandIcon={<ExpandMore className="svg_icons" />}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {recipientId?.length < 15 ? (
                    <Typography variant="h6" mb={0.5}>
                      {entry.recipient.fullName}
                    </Typography>
                  ) : (
                    <h4 style={{ margin: 0 }}>
                      Units Donated: {entry.unitsDonated}
                    </h4>
                  )}

                  <Typography
                    fontSize="0.8rem"
                    color="grey"
                    sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
                  >
                    <LocationOn fontSize="0.8rem" />{" "}
                    {entry.organisation.name.toUpperCase()}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {recipientId?.length < 15 ? (
                  <h4 style={{ margin: 0 }}>
                    Units Donated: {entry.unitsDonated}
                  </h4>
                ) : null}
                <Typography
                  fontSize="0.8rem"
                  color="grey"
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: "1rem" }} />{" "}
                  {new Date(entry.donatedOn).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                {!recipientId ? (
                  <Typography
                    fontSize="0.8rem"
                    color="grey"
                    style={{
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: "1rem" }} />{" "}
                    {entry.recipient.fullName}
                  </Typography>
                ) : null}

                {entry.formImage && (
                  <div
                    style={{
                      display: "flex",
                      margin: "20px",
                    }}
                  >
                    <a href={entry.formImage} download>
                      <img
                        style={{ width: "40vw" }}
                        src={entry.formImage}
                        alt="No Form Image Available"
                      />
                    </a>
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          </>
        );
      })}
      {/* </ul> */}

      <BottomNav />
    </div>
  );
}

export default BloodDonationEntry;
