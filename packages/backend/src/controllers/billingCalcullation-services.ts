// import { Request, Response } from "express";
// import { billingCalculation } from "../services/billingCalcullation.services";

// // POST /api/billing/calculate
// export const calculateBilling = (req: Request, res: Response) => {
//   try {
//     // הנתונים מגיעים מהלקוח (body)
//     const input = req.body;

//     // קריאה לפונקציית החישוב
//     const result = billingCalculation(input);

//     // החזרת התוצאה ללקוח
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };
// //כל קריאת post יפעיל את החישוב
// // import { Router } from "express";
// // import { calculateBilling } from "../controllers/billingCalculation-controller";

// // const router = Router();

// // router.post("/calculate", calculateBilling);

// // export default router;