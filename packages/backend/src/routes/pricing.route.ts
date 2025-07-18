import { Router } from "express";
import {
  createPricingTierController,
  createPricingTierWithHistoryController,
  getCurrentPricingTierController,
  getPricingHistoryController,
  updatePricingTierController,
  deletePricingTierController,
  bulkUpdatePricingTiersController,
  createMeetingRoomPricingController,
  createMeetingRoomPricingWithHistoryController, 
  getCurrentMeetingRoomPricingController,
  getMeetingRoomPricingHistoryController,
  updateMeetingRoomPricingController,
  deleteMeetingRoomPricingController,
  createLoungePricingController,
  getCurrentLoungePricingController,
  getLoungePricingHistoryController,
  updateLoungePricingController,
  deleteLoungePricingController,
} from "../controllers/pricing.controller";
import { authorizeUser } from "../middlewares/authorizeUserMiddleware"; 
import { UserRole } from 'shared-types';

const router = Router();
// === שכבות תמחור לסביבת עבודה ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.post("/workspace", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createPricingTierController); 
router.post("/workspace/history", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createPricingTierWithHistoryController);

// פעולות קריאה (GET) אינן דורשות הרשאת מנהל (עבור "רחל")
router.get("/workspace/current/:workspaceType", getCurrentPricingTierController);
router.get("/workspace/history/:workspaceType", getPricingHistoryController);

// פעולות עדכון ומחיקה דורשות הרשאת מנהל
router.put("/workspace/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updatePricingTierController);
router.delete("/workspace/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), deletePricingTierController); 
router.put("/workspace", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), bulkUpdatePricingTiersController);

// === תמחור חדרי ישיבות ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.post("/meeting-room", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createMeetingRoomPricingController);
router.post("/meeting-room/history", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createMeetingRoomPricingWithHistoryController); 

// פעולות קריאה (GET) אינן דורשות הרשאת מנהל
router.get("/meeting-room/current", getCurrentMeetingRoomPricingController);
router.get("/meeting-room/history", getMeetingRoomPricingHistoryController);

// פעולות עדכון ומחיקה דורשות הרשאת מנהל
router.put("/meeting-room/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updateMeetingRoomPricingController);
router.delete("/meeting-room/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), deleteMeetingRoomPricingController);

// === תמחור טרקלין (לונג') ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.post("/lounge", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createLoungePricingController);

// פעולות קריאה (GET) אינן דורשות הרשאת מנהל
router.get("/lounge/current", getCurrentLoungePricingController);
router.get("/lounge/history", getLoungePricingHistoryController);

// פעולות עדכון ומחיקה דורשות הרשאת מנהל
router.put("/lounge/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updateLoungePricingController);
router.delete("/lounge/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), deleteLoungePricingController);

// === שכבות תמחור לסביבת עבודה (נתיבים נוספים) ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.put("/tier/:id", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), updatePricingTierController);//שינוי כאן
router.post("/tier", authorizeUser([UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MANAGER]), createPricingTierController);
router.get("/tier/current", getCurrentPricingTierController);

// route לבדיקה ללא הרשאות
router.get('/test', (req, res) => {
  res.json({ message: 'pricing route is working!' });
});

export default router;