import axiosInstance from "../axios/axios";

export const fetchOrg = async (query) => {
  const response = await axiosInstance.get(`/organisation?search=${query}`);
  try {
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const fetchOrgId = async (customOrganisation) => {
  const name = customOrganisation;
  try {
    const response = await axiosInstance.post("/organisation", { name });
    return response.data.data._id;
  } catch (err) {
    console.log(err);
  }
};
