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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import backgroundImage from "./images/v915-techi-055-a.jpg";
import "react-image-crop/dist/ReactCrop.css";
import { useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { drawImageOnCanvas, generateDownload } from "../components/utils";
import quote from "./images/—Pngtree—blood donation of medical material_1136102 (1).png";
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
  const [render, setRender] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [resetInputField, setResetInputField] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    height: 100,
    aspect: 1,
  });
  const [file, setFile] = useState(null); // State to hold the selected file
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [completedCrop, setCompletedCrop] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
    setOpenError(false);
  };
  useEffect(() => {
    if (successMessage) {
      setOpenSuccess(true);

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = () => {
    if (!selectedRecipient && customRecipientNumber.length !== 10) {
      setErrMessage("Mobile number must be 10 digits");
      return false;
    }

    if (selectedRecipient && selectedRecipient.mobileNumber.length !== 10) {
      setErrMessage("Recipient's mobile number must be 10 digits");
      return false;
    }

    if (unitsDonated <= 0) {
      setErrMessage("Units donated must be a positive number");
      return false;
    }

    return true;
  };
  const isMobileNumberValid =
    customRecipientNumber.length === 10 ||
    selectedRecipient?.mobileNumber?.length === 10;

  const isUnitsDonatedValid = unitsDonated > 0;

  useEffect(() => {
    if (successMessage) {
      setOpenSuccess(true);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errMessage) {
      setOpenError(true);
    }
  }, [errMessage]);

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
    height: Math.round(completedCrop?.height ?? 0),
    width: Math.round(completedCrop?.width ?? 0),
    border: "2px solid black",
    padding: "2px",
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFile("");
    setRender((prev) => {
      !prev;
    });
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
  // ect(() => {
  //   const timer = setTimeout(() => {
  //     setSuccessMessage("");
  //     setErrMessage("");
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [successMessage, errMessage]);

  const getOrganisationId = async () => {
    if (selectedOrganisation) {
      return selectedOrganisation._id;
    } else {
      const data = await fetchOrgId(customOrganisation);
      return data;
    }
  };
  useEffect(() => {
    if (successMessage || errMessage) {
      setOpen(true);
    }
  }, [successMessage, errMessage]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

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
        setSuccessMessage(response.data.message);
        resetForm();
      } else if (!recipientId) {
        setErrMessage("No recipient selected or entered");
      } else if (!organisationId) {
        setErrMessage("No organisation selected or entered");
      } else {
        setErrMessage("No recipient or organisation selected or entered");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrMessage(error.response.data.message);
    }
    setLoading(false);
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
    setImgSrc("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        margin: 0,
        padding: 0,
      }}
    >
      <Header />
      <img
        src={quote}
        id="top-img"
        style={{
          display: "block",
          marginRight: "auto",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "8vh",
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            flex: 1,
          }}
          onSubmit={handleFormSubmit}
        >
          <h2 style={{ marginBottom: "40px", textAlign: "center" }}>
            Blood Donation Form
          </h2>
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
                sx={{
                  width: "70vw",
                  "@media (min-width: 1024px)": {
                    width: "30vw",
                    alignContent: "center",
                    display: "flex",
                    justifyContent: "center",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      "@media (min-width: 1024px)": {
                        width: "30vw",
                      },
                    }}
                    label="Enter Recipient's Number"
                    variant="outlined"
                    value={
                      selectedRecipient
                        ? selectedRecipient.mobileNumber
                        : customRecipientNumber
                    }
                    onChange={(e) => setCustomRecipientNumber(e.target.value)}
                    error={!!customRecipientNumber && !isMobileNumberValid}
                    helperText={
                      customRecipientNumber && !isMobileNumberValid
                        ? "Mobile number must be 10 digits"
                        : ""
                    }
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
                sx={{
                  width: "70vw",
                  "@media (min-width: 1024px)": {
                    width: "30vw",
                  },
                }}
                onChange={(e) => setCustomRecipientName(e.target.value)}
              />
            </AccordionDetails>
            <AccordionDetails>
              <TextField
                label="Enter Recipient's Details"
                value={about}
                sx={{
                  width: "70vw",
                  "@media (min-width: 1024px)": {
                    width: "30vw",
                  },
                }}
                onChange={(e) => setAbout(e.target.value)}
              />
            </AccordionDetails>

            <AccordionDetails>
              <TextField
                label="Enter Recipient's Address"
                value={address}
                sx={{
                  width: "70vw",
                  "@media (min-width: 1024px)": {
                    width: "30vw",
                  },
                }}
                onChange={(e) => setAddress(e.target.value)}
              />
            </AccordionDetails>
          </Accordion>

          <TextField
            sx={{
              width: "70vw",
              "@media (min-width: 1024px)": {
                width: "30vw",
              },
            }}
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
            sx={{
              width: "70vw",
              "@media (min-width: 1024px)": {
                width: "30vw",
              },
            }}
            label="Units Donated"
            type="number"
            value={unitsDonated}
            onChange={(e) => setUnitsDonated(e.target.value)}
            margin="normal"
            error={!!unitsDonated && !isUnitsDonatedValid}
            helperText={
              unitsDonated && !isUnitsDonatedValid
                ? "Must be a positive number"
                : ""
            }
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
            sx={{
              width: "70vw",
              "@media (min-width: 1024px)": {
                width: "30vw",
              },
            }}
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
            sx={{
              width: "70vw",
              "@media (min-width: 1024px)": {
                width: "30vw",
              },
            }}
            margin="normal"
            key={render}
          />

          {file ? (
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

          {!!successMessage && (
            <Snackbar
              sx={{ marginBottom: "7vh" }}
              open={openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {successMessage}
              </Alert>
            </Snackbar>
          )}

          {/* Error Snackbar */}
          {!!errMessage && (
            <Snackbar
              sx={{ marginBottom: "7vh" }}
              open={openError}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {errMessage}
              </Alert>
            </Snackbar>
          )}
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            className="login-button"
            style={{
              marginTop: "40px",

              backgroundColor: "#C42421",
            }}
          >
            {loading ? <p>loading </p> : <p>Submit</p>}
          </Button>
        </form>

        <BottomNav />
      </div>
    </div>
  );
}

export default BloodDonationForm;
