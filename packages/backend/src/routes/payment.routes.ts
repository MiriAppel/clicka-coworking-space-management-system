import express from "express";
import { getPaymentsByCustomer } from "../controllers/payment.controller";

const router = express.Router();

router.post("/by-customer", getPaymentsByCustomer);

export default router;
