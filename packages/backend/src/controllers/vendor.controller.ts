//controller/vendor.controller.ts
import type{ CreateVendorRequest, Vendor } from 'shared-types';
import {create ,deleteVendor ,getAllVendors ,getVendorById } from '../services/vendor.servic';
import { Request, Response } from 'express';
import { VendorModel } from '../models/vendor.model';
export const createVendorController = async (req: Request, res: Response) => {
  try {
    const newVendor = new VendorModel(req.body); // יצירת מופע מודל מ-req.body
    const vn = await create(req.body as CreateVendorRequest); // העברת המודל
    res.status(201).json(vn);
    console.log("vendor.routes loaded");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const getVendorController = async (req: Request, res: Response) => {
  try {
    const vendors = await getAllVendors();
    res.json(vendors);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const getVendorByIdController = async (req: Request, res: Response) => {
  try {
    const getById = await getVendorById(req.params.id as any);
    res.json(getById);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteVendorController = async (req: Request, res: Response) => {
  try {
    const result = await deleteVendor(req.params.id as any);
    res.json({ success: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


