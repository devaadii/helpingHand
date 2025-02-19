import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import { AdsClickRounded, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NotesIcon from "@mui/icons-material/Notes";
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
  Typography,
  Divider,
} from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import editIcon from "../icons/image copy.png";
import infoIcon from "../icons/image copy 2.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
    navigate(`/BloodDonation-entries/${recipientId}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/recipients");
        setRecipients(res.data.data);
      } catch (err) {}
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
    } catch (err) {}
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
    <div style={{ paddingBottom: "8vh" }}>
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
          Recipient's Information
        </Typography>
        <Autocomplete
          freeSolo
          id="recipients"
          options={options}
          onChange={(e, newValue) => {
            setSelectedRecipients(newValue);
          }}
          getOptionLabel={(option) => `${option.mobileNumber}`}
          sx={{ width: "35vw", marginRight: "10px" }}
          onInputChange={(e, newValue) => {
            searchRecipients(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search" variant="outlined" />
          )}
        />
      </div>
      <Divider />
      <ul
        style={{
          listStyle: "none",
          display: "contents",
        }}
      >
        {recipients.map((recipient) => (
          <li
            key={recipient._id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Accordion
              sx={{ my: 1, width: "90vw" }}
              elevation={5}
              expanded={expanded === recipient._id}
            >
              <AccordionSummary
                onClick={() => handleAccordionToggle(recipient._id)}
                elevation={5}
                expandIcon={<ExpandMore className="svg_icons" />}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1vw",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: "500", fontSize: "1rem" }}
                  >
                    {recipient.fullName}
                  </Typography>
                  <Typography
                    color="grey"
                    variant="string"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {recipient.mobileNumber}
                  </Typography>
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
                    <img id="icon" src={editIcon} alt="Edit" />
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
                        <TextField
                          label="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <TextField
                          label="Mobile Number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                        <TextField
                          label="About"
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                        />
                        <TextField
                          label="Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <Button onClick={handleSubmit}>Submit</Button>
                        <Button onClick={handleClose}>Close</Button>
                      </div>
                    </Box>
                  </Popper>
                  <IconButton onClick={() => handleInfoClick(recipient._id)}>
                    <img
                      id="icon1"
                      style={{ margin: "0 1vw" }}
                      src={infoIcon}
                      alt="Info"
                    />
                  </IconButton>
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                <Typography
                  color="grey"
                  variant="string"
                  style={{
                    fontSize: "0.9rem",
                    fontFamily: "Montserrat, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <NotesIcon sx={{ fontSize: "0.9rem" }} />{" "}
                  {recipient.about || "No Information"}
                </Typography>
                <Typography
                  color="grey"
                  variant="string"
                  style={{
                    fontSize: "0.9rem",
                    fontFamily: "Montserrat, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: "0.9rem" }} />
                  {recipient.address || "No Information"}
                </Typography>
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
