import { Request, Response } from 'express';
import {RoomService} from '../services/room.service';
import { RoomModel } from "../models/room.model";

export class RoomController {
    private roomService = new RoomService();

async createRoom(req: Request, res: Response) {
  console.log('Received request to create room:', req.body);
  try {
    const roomData = {
      ...req.body,
      workspaceMapId: req.body.workspace_map_id, // ← שורת התיקון
    };

    const room = new RoomModel(roomData);
    console.log('Room object created:', JSON.stringify(room, null, 2));

    const result = await this.roomService.createRoomRequest(room);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to create room" });
    }
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


 async getRooms(req: Request, res: Response){
   const result = await this.roomService.getAllrooms();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to fetch booking" });
        }
}


 async  updateRoom(req: Request, res: Response){
    try{
        const roomData = req.body;
        const room = new RoomModel(roomData);
      const updateRoom=await this.roomService.updateRoom(req.params.id,room);
      res.json(updateRoom);
    }
    catch(err){
       res.status(500).json({massage:'err.message'});
    }
}

 async  getRoomById(req: Request, res: Response){
    try{
        const getRoom=await this.roomService.getRoomById(req.params.id);
        res.json(getRoom);
    }
    catch(err){
res.status(500).json({massage:'err.massage'});
    }
}

 async  deleteRoom(req: Request, res: Response) {
    try{
      const deleteRoom=await this.roomService.deleteRoom(req.params.id);
      res.json(deleteRoom);
    }
    catch(err){
      res.status(500).json({massage:'err.massage'});
    }
}
}
