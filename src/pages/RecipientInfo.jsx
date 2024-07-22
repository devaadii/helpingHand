import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import { AdsClickRounded, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  TextField,
  Button,
  Box,
  Popper,
} from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import editIcon from "../icons/image copy.png";
import infoIcon from "../icons/image copy 2.png";

function RecipientInfo() {
  const [recipients, setRecipients] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleInfoClick = (recipientId) => {
    console.log("clicked");
    navigate(`/BloodDonation-entries/${recipientId}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/recipients");
        setRecipients(res.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post("/recipients", {
        fullName,
        about,
        address,
        mobileNumber,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccordionToggle = (recipientId) => {
    setExpanded((prevExpanded) =>
      prevExpanded === recipientId ? false : recipientId
    );
  };

  const handleEditClick = (recipient, event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setFullName(recipient.fullName);
    setMobileNumber(recipient.mobileNumber);
    setAbout(recipient.about);
    setAddress(recipient.address);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const searchRecipients = async (query) => {
    try {
      const response = await fetchRecipients(query);
      setOptions(response);
      setRecipients(response);
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
          Recipient's Information
        </h3>
        <Autocomplete
          freeSolo
          id="recipients"
          options={options}
          onChange={(e, newValue) => {
            setSelectedRecipients(newValue);
          }}
          getOptionLabel={(option) => `${option.mobileNumber}`}
          sx={{ width: "30vw" }}
          onInputChange={(e, newValue) => {
            searchRecipients(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search" variant="outlined" />
          )}
        />
      </div>
      <hr />
      <ul
        style={{
          listStyle: "none",
          display: "contents",
        }}
      >
        {recipients.map((recipient) => (
          <li key={recipient._id}>
            <Accordion
              elevation={5}
              sx={{
                padding: "10px 0px",
                margin: "20px auto",
                backgroundColor: "#FEF9F9",
              }}
              expanded={expanded === recipient._id}
            >
              <AccordionSummary
                onClick={() => handleAccordionToggle(recipient._id)}
                sx={{
                  width: "100%",
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                  },
                }}
                expandIcon={<ExpandMore />}
              >
                <div style={{ width: "50vw" }}>
                  <h3 style={{ margin: "3px" }}>Name: {recipient.fullName}</h3>
                  <h4 style={{ margin: "3px" }}>
                    Number: {recipient.mobileNumber}
                  </h4>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={(event) => handleEditClick(recipient, event)}
                  >
                    <img src={editIcon} alt="Edit" />
                  </IconButton>
                  <Popper id={id} open={open} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
                      <div
                        style={{
                          padding: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        <h2>Edit Recipient</h2>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <input
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                        <input
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                        />
                        <input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <Button onClick={handleSubmit}>Submit</Button>
                        <Button onClick={handleClose}>Close</Button>
                      </div>
                    </Box>
                  </Popper>
                  <IconButton onClick={() => handleInfoClick(recipient._id)}>
                    <img src={infoIcon} alt="Info" />
                  </IconButton>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <h4>About: {recipient.about || "No Information"}</h4>
                <h4>Address: {recipient.address || "No Information"}</h4>
              </AccordionDetails>
            </Accordion>
          </li>
        ))}
      </ul>
      <BottomNav />
    </div>
  );
}

export default RecipientInfo;
