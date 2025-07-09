import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const bookController = new BookingController();
const bookRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123"
 *         roomId:
 *           type: string
 *           example: "room1"
 *         roomName:
 *           type: string
 *           example: "חדר ישיבות"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-07-01T09:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2025-07-01T10:00:00.000Z"
 *         status:
 *           type: string
 *           example: "PENDING"
 *         totalHours:
 *           type: number
 *           example: 1
 *         chargeableHours:
 *           type: number
 *           example: 1
 *         totalCharge:
 *           type: number
 *           example: 100
 *         isPaid:
 *           type: boolean
 *           example: false
 *       required:
 *         - roomId
 *         - roomName
 *         - startTime
 *         - endTime
 *         - status
 */

/**
 * @swagger
 * /api/book/getAllBooking:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Booking
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingModel'
 *       500:
 *         description: Failed to fetch booking
 */
bookRouter.get("/getAllBooking", bookController.getAllBooking.bind(bookController));

/**
 * @swagger
 * /api/book/createBook:
 *   post:
 *     summary: Create a new booking
 *     tags:
 *       - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingModel'
 *     responses:
 *       200:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingModel'
 *       500:
 *         description: Failed to create booking
 */
bookRouter.post("/createBook", bookController.createBook.bind(bookController));
bookRouter.get("/getBookingById/:id", bookController.getBookingById.bind(bookController));
bookRouter.put("/updateBooking/:id", bookController.updateBooking.bind(bookController));
bookRouter.delete("/deleteBooking/:id", bookController.deleteRoom.bind(bookController));
export default bookRouter;
