import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Autocomplete, TextField, Button } from "@mui/material";
import axiosInstance from "../axios/axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore, Padding } from "@mui/icons-material";
import { fetchRecipients, fetchId } from "../api/recipients";
import { fetchOrg, fetchOrgId } from "../api/organisation";

import "react-image-crop/dist/ReactCrop.css";
import { useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { drawImageOnCanvas, generateDownload } from "../components/utils";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

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
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [resetInputField, setResetInputField] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [crop, setCrop] = useState();
  const [file, setFile] = useState(null); // State to hold the selected file
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setOpenDialog(true);
    }
  };

  const handleCompleteCrop = (crop) => {
    drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
    setCompletedCrop(crop);
  };

  const handleSend = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const imgFile = new File([blob], "cropped-image.png", {
          type: "image/png",
        });
        setOpenDialog(false);
        console.log(imgFile);
        setFile(imgFile);

        // Optionally, create a download link
        const url = URL.createObjectURL(imgFile);
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "cropped-image.png";
        // a.click();
        // URL.revokeObjectURL(url); // Clean up
      }

      // const url = URL.createObjectURL(blob);
      // const formImage = document.createElement("a");
      // a.href = url;
      // a.download = "cropped-image.png";
      // a.click();
      // console.log(url);
      // console.log(a);
    });
    // const url = URL.createObjectURL(blob);

    // generateDownload(canvasRef.current, completedCrop);
    // console.log(url);
  };

  // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
  const canvasStyles = {
    width: "68vw",
    height: Math.round(completedCrop?.height ?? 0),
    border: "2px solid black",
    padding: "2px",
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

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
    setLoading(true);
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
        console.log(file);
        console.log(response.data);
        setSuccessMessage(response.data.message);
        setLoading(false);
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
            accept="image/*"
            onChange={handleFileChange}
            sx={{ width: "70vw" }}
            margin="normal"
          />

          {crop ? (
            <div className="CanvasWrapper">
              <canvas ref={canvasRef} style={canvasStyles} />
            </div>
          ) : null}

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Selected Image</DialogTitle>
            <DialogContent style={{ width: "70vw", height: "50vh" }}>
              <div className="CropperWrapper">
                <ReactCrop
                  crop={crop}
                  onChange={setCrop}
                  aspect={1}
                  onComplete={handleCompleteCrop}
                >
                  {imgSrc && (
                    <img ref={imgRef} src={imgSrc} alt="cropper image" />
                  )}
                </ReactCrop>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                type="button"
                disabled={!completedCrop}
                onClick={handleSend}
              >
                Crop Image
              </button>
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
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
            disabled={loading}
            variant="contained"
            type="submit"
            className="login-button"
            style={{
              marginTop: "40px",
              width: "70vw",
              backgroundColor: "#C42421",
            }}
          >
            Submit{loading}
          </Button>
        </form>
        <BottomNav />
      </div>
    </div>
  );
}

export default BloodDonationForm;
