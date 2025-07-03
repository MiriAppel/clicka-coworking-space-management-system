import express from 'express';
import * as paymentController from '../controllers/payment.controller';

const routerPayment = express.Router();

// (GET) קבלת כל התשלומים
routerPayment.get('/', paymentController.getAllPayments);

// (GET) קבלת תשלום לפי מזהה
routerPayment.get('/id/:id', paymentController.getPaymentById);

// (GET) קבלת תשלומים לפי פילטרים
routerPayment.get('/filter', paymentController.getPaymentByFilter);

// (POST) יצירת תשלום חדש
routerPayment.post('/post-customer', paymentController.createPayment);

// (PATCH) עדכון תשלום לפי ID
routerPayment.patch('/:id', paymentController.updatePayment);

// (DELETE) מחיקת תשלום לפי ID
routerPayment.delete('/:id', paymentController.deletePayment);

export default routerPayment;