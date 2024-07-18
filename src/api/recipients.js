import axiosInstance from "../axios/axios";

export const fetchRecipients = async (query) => {
  const response = await axiosInstance.get(`/recipients?search=${query}`);
  try {
    return response.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchId = async (fullName, mobileNumber, about, address) => {
  const response = await axiosInstance.post("/recipients", {
    fullName,
    mobileNumber,
    about,
    address,
  });
  try {
    return response.data.data._id;
  } catch {
    err;
  }
  {
    console.log(err);
  }
};
