import { Request, Response } from "express";
import { PaymentService } from "../services/payments.service";

export async function getPaymentsByCustomer(req: Request, res: Response) {
  try {
    const { dateFrom, dateTo, customerIds } = req.body;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ error: "Missing required date range." });
    }

    const payments = await PaymentService.getPaymentByDateAndCIds({
      dateFrom,
      dateTo,
      customerIds,
    });

    res.json(payments);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
}
