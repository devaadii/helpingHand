import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Autocomplete, TextField, Button } from "@mui/material";
import axiosInstance from "../axios/axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore } from "@mui/icons-material";
import { fetchRecipients, fetchId } from "../api/recipients";
import { fetchOrg, fetchOrgId } from "../api/organisation";

function BloodDonationForm() {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [customRecipientNumber, setCustomRecipientNumber] = useState("");
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
  const [customRecipientName, setCustomRecipientName] = useState("");
  const [customOrganisation, setCustomOrganisation] = useState("");
  const [donatedOn, setDonatedOn] = useState("");
  const [unitsDonated, setUnitsDonated] = useState("");
  const [options, setOptions] = useState([]);
  const [file, setFile] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [resetInputField, setResetInputField] = useState(false);

  const fetchOrganisation = async (query) => {
    const data = await fetchOrg(query);
    try {
      setOrganisations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOptions = async (query) => {
    const data = await fetchRecipients(query);
    try {
      setOptions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getRecipientId = async () => {
    if (selectedRecipient) {
      return selectedRecipient._id;
    } else {
      const fullName = customRecipientName;
      const mobileNumber = customRecipientNumber;
      const data = await fetchId(fullName, mobileNumber, about, address);
      try {
        return data;
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrMessage("");
      console.log("done");
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage, errMessage]);

  const getOrganisationId = async () => {
    if (selectedOrganisation) {
      return selectedOrganisation._id;
    } else {
      const data = await fetchOrgId(customOrganisation);
      return data;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const organisationId = await getOrganisationId();
      const recipientId = await getRecipientId();

      if (recipientId && organisationId) {
        const formData = new FormData();
        formData.append("recipient", recipientId);
        formData.append("organisation", organisationId);
        formData.append("donatedOn", donatedOn);
        formData.append("unitsDonated", unitsDonated);
        if (file) {
          formData.append("formImage", file);
        }

        const response = await axiosInstance.post("/blood-donation", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
        setSuccessMessage(response.data.message);
        resetForm();
      } else if (recipientId) {
        console.log("No organisation selected or entered");
        setErrMessage("No organisation selected or entered");
      } else if (organisationId) {
        console.log("No recipient  selected or entered");
        setErrMessage("No recipientselected or entered");
      } else {
        console.log("No recipient or organisation selected or entered");
        setErrMessage("No recipient or organisation selected or entered");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrMessage(error.response.data.message);
    }
  };
  const handleAutocompleteClick = () => {
    if (!selectedRecipient) {
      setExpanded(true);
    }
  };
  const handleAccordionChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  const resetForm = () => {
    setTimeout(() => {
      setResetInputField((prev) => !prev);
    }, 2000);
    setSelectedRecipient(null);
    setCustomRecipientNumber("");
    setOrganisations([]);
    setSelectedOrganisation(null);
    setCustomRecipientName("");
    setCustomOrganisation("");
    setDonatedOn("");
    setUnitsDonated("");
    setOptions([]);
    setFile("");
    setExpanded(false);
    setAbout("");
    setAddress("");
  };

  return (
    <div
      style={{
        height: "110vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <Header />

      <div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "60px 60px",
          }}
          onSubmit={handleFormSubmit}
        >
          <h2 style={{ marginBottom: "40px" }}>Blood Donation Form</h2>
          <Accordion
            elevation={0}
            expanded={expanded && !selectedRecipient}
            onChange={handleAccordionChange}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                "& .MuiAccordionSummary-expandIconWrapper": {
                  position: "absolute",
                  right: "-15px",
                },
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiAutocomplete-root": {
                  flex: 1,
                },
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
            >
              <Autocomplete
                freeSolo
                id="recipients"
                key={resetInputField}
                options={options}
                filterOptions={(x) => x}
                fullWidth
                getOptionLabel={(option) => `${option.mobileNumber}`}
                value={selectedRecipient}
                onChange={(e, newValue) => {
                  setSelectedRecipient(newValue);
                  setExpanded(false);
                }}
                onClick={handleAutocompleteClick}
                onInputChange={(e, newInputValue) => {
                  fetchOptions(newInputValue);
                }}
                sx={{ width: "70vw" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter Recipient's Number"
                    variant="outlined"
                    value={
                      selectedRecipient
                        ? selectedRecipient.mobileNumber
                        : customRecipientNumber
                    }
                    onChange={(e) => setCustomRecipientNumber(e.target.value)}
                    margin="normal"
                  />
                )}
              />
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Enter Recipient's Name"
                value={
                  selectedRecipient
                    ? selectedRecipient.fullName
                    : customRecipientName
                }
                sx={{ width: "70vw" }}
                onChange={(e) => setCustomRecipientName(e.target.value)}
              />
            </AccordionDetails>
            <AccordionDetails>
              <TextField
                label="Enter Recipient's Details"
                value={about}
                sx={{ width: "70vw" }}
                onChange={(e) => setAbout(e.target.value)}
              />
            </AccordionDetails>

            <AccordionDetails>
              <TextField
                label="Enter Recipient's Address"
                value={address}
                sx={{ width: "70vw" }}
                onChange={(e) => setAddress(e.target.value)}
              />
            </AccordionDetails>
          </Accordion>

          <TextField
            sx={{ width: "70vw" }}
            label="Donated On"
            type="date"
            value={donatedOn}
            onChange={(e) => setDonatedOn(e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx={{ width: "70vw" }}
            label="Units Donated"
            type="number"
            value={unitsDonated}
            onChange={(e) => setUnitsDonated(e.target.value)}
            margin="normal"
          />
          <Autocomplete
            freeSolo
            id="organisation"
            key={resetInputField}
            options={organisations}
            margin="normal"
            fullWidth
            getOptionLabel={(option) => `${option.name}`}
            value={selectedOrganisation}
            onChange={(e, newValue) => {
              setSelectedOrganisation(newValue);
            }}
            onInputChange={(e, newValue) => {
              fetchOrganisation(newValue);
            }}
            sx={{ width: "70vw" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Organisation"
                variant="outlined"
                value={
                  selectedOrganisation
                    ? selectedOrganisation
                    : customOrganisation
                }
                margin="normal"
                onChange={(e) => setCustomOrganisation(e.target.value)}
              />
            )}
          />
          <TextField
            type="file"
            variant="outlined"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            margin="normal"
            sx={{ width: "70vw" }}
          />
          {/* <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            style={{ marginTop: "15px" }}
          /> */}

          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errMessage && <p style={{ color: "#c42421" }}>{errMessage}</p>}
          <Button
            variant="contained"
            type="submit"
            className="login-button"
            style={{
              marginTop: "40px",
              width: "70vw",
              backgroundColor: "#C42421",
            }}
          >
            Submit
          </Button>
        </form>
        <BottomNav />
      </div>
    </div>
  );
}

export default BloodDonationForm;
