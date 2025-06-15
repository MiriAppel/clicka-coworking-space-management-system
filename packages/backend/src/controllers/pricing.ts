import { Request, Response } from "express";
import {
  createPricingTier,
  createPricingTierWithHistory,
  getPricingHistory,
  getCurrentPricingTier,
  updatePricingTier,
  deactivatePricingTier
} from "../services/billingService";
import { PricingTierCreateRequest, WorkspaceType } from "../types";

export class BillingController {
  /**
   * יצירת שכבת תמחור חדשה
   */
  static createTier(req: Request, res: Response) {
    try {
      const request: PricingTierCreateRequest = req.body;
      const createdBy = req.user?.id || "system"; // נניח שיש middleware שמכניס user ל־req
      const newTier = createPricingTier(request, createdBy);
      res.status(201).json(newTier);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  /**
   * יצירת שכבת תמחור עם ניהול היסטוריה
   */
  static createTierWithHistory(req: Request, res: Response) {
    try {
      const request: PricingTierCreateRequest = req.body;
      const createdBy = req.user?.id || "system";
      const newTier = createPricingTierWithHistory(request, createdBy);
      res.status(201).json(newTier);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  /**
   * קבלת היסטוריית התמחור לסוג סביבת עבודה
   */
  static getPricingHistory(req: Request, res: Response) {
    try {
      const workspaceType = req.params.workspaceType as WorkspaceType;
      const history = getPricingHistory(workspaceType);
      res.status(200).json(history);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  /**
   * קבלת שכבת התמחור הפעילה כיום
   */
  static getCurrentPricing(req: Request, res: Response) {
    try {
      const workspaceType = req.params.workspaceType as WorkspaceType;
      const current = getCurrentPricingTier(workspaceType);
      if (!current) {
        return res.status(404).json({ message: "No active pricing tier found" });
      }
      res.status(200).json(current);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

/**
 * עדכון שכבת תמחור קיימת לפי מזהה
 */
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

/**
 * מחיקה לוגית של שכבת תמחור (לא הסרה פיזית)
 */
static deactivateTier(req: Request, res: Response) {
  try {
    const tier: PricingTier = req.body; // נניח שהלקוח שולח את האובייקט המלא למחיקה
    const updatedBy = req.user?.id || "system";
    const deactivated = deactivatePricingTier(tier, updatedBy);
    res.status(200).json(deactivated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
}
