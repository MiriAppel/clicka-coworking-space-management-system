import express from "express";
import { getPaymentsByCustomer, sendPaymentReminder } from "../controllers/payment.controller";

const router = express.Router();

router.post("/by-customer", getPaymentsByCustomer);
// שליחת תזכורת תשלום במייל
router.post("/send-payment-reminder", sendPaymentReminder);

export default router;
