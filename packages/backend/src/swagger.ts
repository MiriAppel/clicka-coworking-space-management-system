
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
export {};