import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import { fetchRecipients } from "../api/recipients";
import { ExpandMore } from "@mui/icons-material";
import {
  Autocomplete,
  Paper,
  Typography,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import edit from "../icons/image copy.png";
import Info from "../icons/image copy 2.png";
import expand from "../icons/image copy 3.png";

function RecipientInfo() {
  const [recipients, setRecipients] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  //   const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get("/recipients");
      try {
        setRecipients(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  function handleClick() {
    setExpanded(true);
  }

  const searchRecipients = async (query) => {
    const response = await fetchRecipients(query);
    try {
      setOptions(response);
      setRecipients(response);
      console.log(response);
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
          //   filterOptions={(x) => x}
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
      <hr></hr>
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
            >
              <AccordionSummary
                sx={{
                  width: "100%",
                  "& .MuiAccordionSummary-expandIconWrapper": {},
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiAutocomplete-root": {
                    flex: 1,
                  },
                }}
                expandIcon={<ExpandMore />}
              >
                {" "}
                <div style={{ width: "50vw" }}>
                  <h4 style={{ margin: "3px" }}>Name:{recipient.fullName}</h4>
                  <h5 style={{ margin: "3px" }}>
                    Number:{recipient.mobileNumber}
                  </h5>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton>
                    <img id="icon" src={edit} />{" "}
                  </IconButton>
                  <IconButton>
                    <img id="icon1" src={Info} />{" "}
                  </IconButton>
                  {/* <IconButton>
                    <img id="icon" src={expand} />{" "}
                  </IconButton> */}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {recipient.about ? (
                  <h5>About:{recipient.about}</h5>
                ) : (
                  <h5>About:No Information</h5>
                )}
                {recipient.address ? (
                  <h5>Address:{recipient.address}</h5>
                ) : (
                  <h5>Address:No Information</h5>
                )}
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
