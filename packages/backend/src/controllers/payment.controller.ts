// // payment.controller.ts
// import { Request, Response } from 'express';
// import type{ ID } from 'shared-types';
// import { PaymentService } from '../services/payments.service';

// export const payment = {
//   async recordPayment(req: Request, res: Response) {
//     try {
//       const payment = await PaymentService.recordPayment(req.body, req.body.user.id);
//       res.status(201).json(payment);
//     } catch (error:any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   async getCustomerBalance(req: Request, res: Response) {
//     try {
//       const balance = await PaymentService.getCustomerBalance(req.params.customerId);
//       res.json(balance);
//     } catch (error:any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   async getOverdueInvoices(req: Request, res: Response) {
//     try {
//       const overdue = await paymentService.getOverdueInvoices();
//       res.json(overdue);
//     } catch (error:any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   async getPaymentHistory(req: Request, res: Response) {
//     try {
//       const payments = await paymentService.getPaymentHistory(req.params.customerId);
//       res.json(payments);
//     } catch (error:any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   async matchPaymentsToInvoices(req: Request, res: Response) {
//     try {
//       await paymentService.matchPaymentsToInvoices(req.params.customerId, req.body);
//       res.status(200).json({ message: 'התשלומים הותאמו בהצלחה' });
//     } catch (error:any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   async matchPaymentToInvoice(req: Request, res: Response) {
//     try {
//       await paymentService.matchPaymentsToInvoice(req.params.customerId, req.body.payment, req.body.invoice);
//       res.status(200).json({ message: 'התשלום שויך בהצלחה לחשבונית' });
//     } catch (error:any) {
//       res.status(400).json({ error: error.message });
//     }
//   }
  
// };
// //לרחל
// const paymentService = new PaymentService();
// // תיעוד תשלום חדש
// export const recordPaymentController = (req: Request, res: Response) => {
//   try {
//     const userId: ID = req.body.user?.id || "SYSTEM";
//     const payment = paymentService.recordAndApplyPayment(req.body, userId);
//     res.status(201).json(payment);
//   } catch (error) {
//     res.status(400).json({ message: (error as Error).message });
//   }
// };