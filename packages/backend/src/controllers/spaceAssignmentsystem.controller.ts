import { SpaceAssignmentModel } from "../models/spaceAssignment.model";
import { SpaceAssignmentService } from "../services/spaceAssignmentsystem.service";
import { Request, Response } from "express";

export class SpaceAssignmentController {
    spaceAssignmentService = new SpaceAssignmentService();
    async createSpace(req: Request, res: Response) {
        console.log('Received request to create space:', req.body);
        const spaceData = req.body;
        console.log('Prepared space data:', JSON.stringify(spaceData, null, 2));
        const space = new SpaceAssignmentModel(spaceData);
        const result = await this.spaceAssignmentService.createSpace(space);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to create user" });
        }
    }

    async getAllSpaces(req: Request, res: Response) {
        const result = await this.spaceAssignmentService.getAllSpaces();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to fetch space" });
        }
    }


    async updateSpace(req: Request, res: Response) {
        try {
            const spaceData = req.body;
            const space = new SpaceAssignmentModel(spaceData);
            const updateSpace = await this.spaceAssignmentService.updateSpace(req.params.id, space);
            res.json(updateSpace);
        }
        catch (err) {
            res.status(500).json({ massage: 'err.message' });
        }
    }

    async getSpaceById(req: Request, res: Response) {
        try {
            const getBooking = await this.spaceAssignmentService.getSpaceById(req.params.id);
            res.json(getBooking);
        }
        catch (err) {
            res.status(500).json({ massage: 'err.massage' });
        }
    }

    async deleteSpace(req: Request, res: Response) {
        try {
            const deleteSpace = await this.spaceAssignmentService.deleteSpace(req.params.id);
            res.json(deleteSpace);
        }
        catch (err) {
            res.status(500).json({ massage: 'err.massage' });
        }
    }


    async getOccupancyReport(req: Request, res: Response) {
        try {
            const { type, dateRange } = req.params;
            const {startDate, endDate} = dateRange ? JSON.parse(dateRange) : {};
            console.log('Received request for occupancy report:', { type, dateRange });
            const report = await this.spaceAssignmentService.getOccupancyReport(type, startDate, endDate);
            res.json(report);
        } catch (err) {
            console.error('Error fetching occupancy report:', err);
            res.status(500).json({ message: 'Error fetching occupancy report' });
        }
    }

}


