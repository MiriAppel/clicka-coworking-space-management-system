// import { VendorService } from "../services/vendor-service";
// import { VendorModel } from "../models/Vendor";
import { Request, Response } from "express";
import { VendorModel } from "../models/vendor.model";
import { VendorService } from "../services/vendor.service";

export class VendorController {
    vendorService = new VendorService();

    async create(req: Request, res: Response) {
        const data = req.body;
        const vendor = new VendorModel(data);
        const result = await this.vendorService.createVendor(vendor);
        if (result) res.status(201).json(result);
        else res.status(500).json({ error: "Failed to create vendor" });
    }

    async getAll(req: Request, res: Response) {
        const result = await this.vendorService.getAllVendors();
        if (result) res.status(200).json(result);
        else res.status(500).json({ error: "Failed to fetch vendors" });
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        const result = await this.vendorService.getVendorById(id);
        if (result) res.status(200).json(result);
        else res.status(404).json({ error: "Vendor not found" });
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const updatedVendor = new VendorModel(req.body);
        const result = await this.vendorService.updateVendor(id, updatedVendor);
        if (result) res.status(200).json(result);
        else res.status(500).json({ error: "Failed to update vendor" });
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id;
        const result = await this.vendorService.deleteVendor(id);
        if (result) res.status(200).send();
        else res.status(500).json({ error: "Failed to delete vendor" });
    }
}