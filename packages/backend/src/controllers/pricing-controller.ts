import { Request, Response } from "express";
import {
  createPricingTier,
  createPricingTierWithHistory,
  getCurrentPricingTier,
  getPricingHistory,
  getAllPricingTiers,
  getPricingTierById,
  updatePricingTier,
  deletePricingTier
} from "../services/billingService";

import { PricingTierCreateRequest, PricingTier, WorkspaceType } from "../types";

export class PricingController {
  // יצירת שכבת תמחור חדשה, עם או בלי היסטוריה
  static createTier(req: Request, res: Response) {
    try {
      const request: PricingTierCreateRequest = req.body;
      const withHistory = req.query.withHistory === 'true';
      const createdBy = req.user?.id || "system";

      const newTier = withHistory
        ? createPricingTierWithHistory(request, createdBy)
        : createPricingTier(request, createdBy);

      res.status(201).json(newTier);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // שליפה של כל שכבות התמחור
  static getAllTiers(req: Request, res: Response) {
    try {
      const tiers = getAllPricingTiers();
      res.status(200).json(tiers);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // שליפה של שכבת תמחור לפי מזהה
  static getTierById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const tier = getPricingTierById(id);
      if (!tier) {
        res.status(404).json({ error: "Tier not found" });
        return;
      }
      res.status(200).json(tier);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // שליפת שכבת התמחור הפעילה לפי סוג סביבת עבודה
  static getCurrentTier(req: Request, res: Response) {
    try {
      const workspaceType = req.query.workspaceType as WorkspaceType;
      const tier = getCurrentPricingTier(workspaceType);
      res.status(200).json(tier);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // שליפת היסטוריית שכבות תמחור
  static getHistory(req: Request, res: Response) {
    try {
      const workspaceType = req.query.workspaceType as WorkspaceType;
      const history = getPricingHistory(workspaceType);
      res.status(200).json(history);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // עדכון שכבת תמחור קיימת
  static updateTier(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const update = req.body;
      const updatedBy = req.user?.id || "system";
      const updated = updatePricingTier(id, update, updatedBy);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // מחיקה לוגית של שכבת תמחור
  static deletePricingTier(req: Request, res: Response) {
    try {
      const tier: PricingTier = req.body;
      const updatedBy = req.user?.id || "system";
      const deactivated = deletePricingTier(tier, updatedBy);
      res.status(200).json(deactivated);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
  }