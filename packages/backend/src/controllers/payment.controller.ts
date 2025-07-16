import { Request, Response } from "express";
import { PaymentService, sendPaymentProblemEmailInternal} from "../services/payments.service";
import { UserTokenService } from "../services/userTokenService";


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
const paymentService = new PaymentService();
export const sendPaymentReminder = async (req: Request, res: Response) => {
  try {
    console.log("sendPaymentReminder called with body:", req.body);

    const userTokenService = new UserTokenService();
    const token = await userTokenService.getSystemAccessToken();

    const {
      customerName,
      amount,
      invoiceNumber,
      dueDate,
    } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: missing access token" });
    }

    if (!customerName || !amount || !invoiceNumber || !dueDate ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    await paymentService.sendPaymentReminderEmail(
      customerName,
      amount,
      invoiceNumber,
      dueDate,
      token
    );

    res.status(200).json({ message: "Payment reminder email sent successfully." });
  } catch (error) {
    console.error("Error in sendPaymentReminder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//////////////////////////////////////////////////////////

export const sendPaymentProblemEmail = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      invoiceNumber,
      amount,
      paymentStatus,
      invoiceUrl,
      customerEmail,
    } = req.body;

    const token = await new UserTokenService().getSystemAccessToken();

    await sendPaymentProblemEmailInternal(
      customerName,
      invoiceNumber,
      amount,
      paymentStatus,
      invoiceUrl,
      customerEmail,
      token
    );

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending payment problem email:", error);
    res.status(500).send("Failed to send email");
  }
};

