import axios from "axios";
import { Vendor, VendorCategory } from "shared-types";

const BASE_URL = "http://localhost:3001";

export const getAllVendors = async () => {
  const response = await axios.get(`${BASE_URL}/vendor/`);
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

// מחיקת ספק - במקום למחוק פיזית, מעדכנים את השדה active ל-false
export const deleteVendor = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/vendor/${id}`);
  return response.data;
};
