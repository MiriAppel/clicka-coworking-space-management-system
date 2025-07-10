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
// import { testPostController } from "../controllers/test.controller";

const router = Router();

// === שכבות תמחור לסביבת עבודה ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.post("/workspace", authorizeUser([UserRole.ADMIN]), createPricingTierController);
router.post("/workspace/history", authorizeUser([UserRole.ADMIN]), createPricingTierWithHistoryController);

// פעולות קריאה (GET) אינן דורשות הרשאת מנהל (עבור "רחל")
router.get("/workspace/current/:workspaceType", getCurrentPricingTierController);
router.get("/workspace/history/:workspaceType", getPricingHistoryController);

// פעולות עדכון ומחיקה דורשות הרשאת מנהל
router.put("/workspace/:id", authorizeUser([UserRole.ADMIN]), updatePricingTierController);
router.delete("/workspace/:id", authorizeUser([UserRole.ADMIN]), deletePricingTierController);
router.put("/workspace", authorizeUser([UserRole.ADMIN]), bulkUpdatePricingTiersController); // עדכון קבוצתי

// === תמחור חדרי ישיבות ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.post("/meeting-room", authorizeUser([UserRole.ADMIN]), createMeetingRoomPricingController);
router.post("/meeting-room/history", authorizeUser([UserRole.ADMIN]), createMeetingRoomPricingWithHistoryController); // ✅ נוספה כאן

// פעולות קריאה (GET) אינן דורשות הרשאת מנהל
router.get("/meeting-room/current", getCurrentMeetingRoomPricingController);
router.get("/meeting-room/history", getMeetingRoomPricingHistoryController);

// פעולות עדכון ומחיקה דורשות הרשאת מנהל
router.put("/meeting-room/:id", authorizeUser([UserRole.ADMIN]), updateMeetingRoomPricingController);
router.delete("/meeting-room/:id", authorizeUser([UserRole.ADMIN]), deleteMeetingRoomPricingController);

// === תמחור טרקלין (לונג') ===
// פעולות יצירה ועדכון דורשות הרשאת מנהל
router.post("/lounge", authorizeUser([UserRole.ADMIN]), createLoungePricingController);

// פעולות קריאה (GET) אינן דורשות הרשאת מנהל
router.get("/lounge/current", getCurrentLoungePricingController);
router.get("/lounge/history", getLoungePricingHistoryController);

// פעולות עדכון ומחיקה דורשות הרשאת מנהל
router.put("/lounge/:id", authorizeUser([UserRole.ADMIN]), updateLoungePricingController);
router.delete("/lounge/:id", authorizeUser([UserRole.ADMIN]), deleteLoungePricingController);

// // route לבדיקה ללא הרשאות
// router.get('/test-no-auth', (req, res) => {
//   console.log("Got /test-no-auth request");
//   res.json({ message: 'This route works without auth or cookies!' });
// });

export default router;
