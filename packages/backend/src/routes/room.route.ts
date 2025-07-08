import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

const roomController = new RoomController();
const roomRouter = Router();

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
 * /api/rooms/getAllBooking:
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
roomRouter.get("/getAllRooms", roomController.getRooms.bind(roomController));

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
roomRouter.post("/createRoom", roomController.createRoom.bind(roomController));
roomRouter.put("/updateRoom/:id", roomController.updateRoom.bind(roomController));
roomRouter.get("/getRoomById/:id", roomController.getRoomById.bind(roomController));
roomRouter.delete("/deleteRoom/:id", roomController.deleteRoom.bind(roomController));
export default roomRouter;
