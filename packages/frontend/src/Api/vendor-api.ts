import axios from "axios";
import { Vendor, VendorCategory } from "shared-types";

const BASE_URL = "http://localhost:3001";

export const getAllVendors = async () => {
  const response = await axios.get(`${BASE_URL}/vendor/getAllVendors`);
  return response.data;
};

export const createVendor = async (data: {
  name: string;
  category: VendorCategory;
  phone: string;
  email: string;
  address: string;
}) => {
  const response = await axios.post(`${BASE_URL}/vendor/createVendor`, data);
  return response.data;
};
// עדכון ספק קיים לפי מזהה
export const updateVendor = async (id: string, data: Partial<Vendor>) => {
  const response = await axios.put(`${BASE_URL}/vendor/updateVendor/${id}`, data);
  return response.data;
};
