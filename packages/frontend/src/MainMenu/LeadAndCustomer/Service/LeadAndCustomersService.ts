// src/api/leadCustomer.ts

import {
  Lead,
  CreateLeadRequest,
  Customer,
  UpdateCustomerRequest,
  RecordExitNoticeRequest,
  StatusChangeRequest,
} from 'shared-types';
import { axiosInstance } from '../../../Services/Axios';

// ---------- לידים ----------

export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await axiosInstance.get<Lead[]>('/leads');
    return response.data;
  } catch (error) {
    console.error('Error getting all leads:', error);
    throw error;
  }
};

export const createLead = async (lead: CreateLeadRequest): Promise<Lead> => {
  try {
    const response = await axiosInstance.post<Lead>('/leads', lead);
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

// ---------- לקוחות ----------

export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await axiosInstance.get<Customer[]>('/customers');
    return response.data;
  } catch (error) {
    console.error('Error getting all customers:', error);
    throw error;
  }
};

export const getCustomersByPage = async (page = 1, pageSize = 50): Promise<Customer[]> => {
  try {
    const response = await axiosInstance.get<Customer[]>(`/customers/page?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error getting customers by page:', error);
    throw error;
  }
};

export const getAllCustomerStatus = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<string[]>('/customers/status/all');
    return response.data;
  } catch (error) {
    console.error('Error getting customer statuses:', error);
    throw error;
  }
};

export const getCustomersToNotify = async (id: string): Promise<Customer[]> => {
  try {
    const response = await axiosInstance.get<Customer[]>(`/customers/notify/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting customers to notify:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await axiosInstance.get<Customer>(`/customers/id/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting customer by ID:', error);
    throw error;
  }
};

export const getCustomersByFilter = async (filters: Record<string, any>): Promise<Customer[]> => {
  try {
    const response = await axiosInstance.get<Customer[]>('/customers/filter', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error filtering customers:', error);
    throw error;
  }
};

export const postExitNotice = async (id: string, data: RecordExitNoticeRequest): Promise<void> => {
  try {
    await axiosInstance.post(`/customers/exit-notice`, { id, ...data });
  } catch (error) {
    console.error('Error posting exit notice:', error);
    throw error;
  }
};

export const createCustomer = async (data: any): Promise<Customer> => {
  try {
    const response = await axiosInstance.post<Customer>('/customers/post-customer', data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const patchCustomer = async (id: string, data: Partial<UpdateCustomerRequest>): Promise<void> => {
  try {
    await axiosInstance.patch(`/customers/${id}`, data);
  } catch (error) {
    console.error('Error patching customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/customers/${id}`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const changeCustomerStatus = async (id: string, data: StatusChangeRequest): Promise<Customer> => {
  try {
    const response = await axiosInstance.post<Customer>(`/customers/${id}/change-status`, data);
    return response.data;
  } catch (error) {
    console.error('Error changing customer status:', error);
    throw error;
  }
};

export const recordExitNotice = async (id: string, data: RecordExitNoticeRequest): Promise<Customer> => {
  try {
    const response = await axiosInstance.post<Customer>(`/customers/${id}/exit-notice`, data);
    return response.data;
  } catch (error) {
    console.error('Error recording exit notice:', error);
    throw error;
  }
};
