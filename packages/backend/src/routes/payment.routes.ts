import express from "express";
import { getPaymentsByCustomer, sendPaymentProblemEmail, sendPaymentReminder } from "../controllers/payment.controller";

const router = express.Router();

router.post("/by-customer", getPaymentsByCustomer);
// שליחת תזכורת תשלום במייל
router.post("/send-payment-reminder", sendPaymentReminder);
router.post("/payment-problem", sendPaymentProblemEmail);

export default router;
