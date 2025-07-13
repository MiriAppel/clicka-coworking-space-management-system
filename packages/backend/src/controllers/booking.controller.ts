import { BookingModel } from "../models/booking.model";
import { BookingService } from "../services/booking.service";
import { Request, Response } from "express";

export class BookingController {
    bookingservice = new BookingService();
    async createBook(req: Request, res: Response) {
        console.log('Received request to create book:', req.body);
        const bookData = req.body;
        console.log('Prepared book data:', JSON.stringify(bookData, null, 2));
        const book = new BookingModel(bookData);
        const result = await this.bookingservice.createBooking(book);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to create user" });
        }
    }
    
       async getAllBooking(req: Request, res: Response) {
        const result = await this.bookingservice.getAllBooking();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to fetch booking" });
        }
    }


 async  updateBooking(req: Request, res: Response){
    try{
        const bookingData = req.body;
        const booking = new BookingModel(bookingData);
      const updateBooking = await BookingService.updateBooking(req.params.id, booking);
      res.json(updateBooking);
    }
    catch(err){
       res.status(500).json({massage:'err.message'});
    }
}

 async  getBookingById(req: Request, res: Response){
    try{
        const getBooking=await this.bookingservice.getBookingById(req.params.id);
        res.json(getBooking);
    }
    catch(err){
res.status(500).json({massage:'err.massage'});
    }
}

 async  deleteRoom(req: Request, res: Response) {
    try{
      const deleteBooking=await this.bookingservice.deleteBooking(req.params.id);
      res.json(deleteBooking);
    }
    catch(err){
      res.status(500).json({massage:'err.massage'});
    }
}
}

 
