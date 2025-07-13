import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const bookController = new BookingController();
const bookRouter = Router();

bookRouter.get("/getAllBooking", bookController.getAllBooking.bind(bookController));
bookRouter.post("/", bookController.createBook.bind(bookController));
bookRouter.get("/getBookingById/:id", bookController.getBookingById.bind(bookController));
bookRouter.put("/updateBooking/:id", bookController.updateBooking.bind(bookController));
bookRouter.delete("/deleteBooking/:id", bookController.deleteRoom.bind(bookController));
export default bookRouter;
