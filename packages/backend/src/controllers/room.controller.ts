import { Request, Response } from 'express';
import RoomService from '../services/room.service';

// ליצירת חדר
export async function CreateRoom(req: Request, res: Response) {
  try {
    const room = await RoomService.CreateRoomRequest(req.body);
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'err.message' });
  }
}

export async function UpdateRoom(req: Request, res: Response){
    try{
      const updateRoom=await RoomService.UpdateRoomRequest(req.params.id);
      res.json(updateRoom);
    }
    catch(err){
       res.status(500).json({massage:'err.message'});
    }
}
export async function GetRoom(req: Request, res: Response){
    try{
        const getRoom=await RoomService.GetRoomRequest(req.params.id);
        res.json(getRoom);
    }
    catch(err){
res.status(500).json({massage:'err.massage'});
    }
}
export async function GetRooms(req: Request, res: Response){
    try{
        const getAll=await RoomService.GetRoomsRequest(req.body);
        res.json(getAll)
    }
    catch{
        res.status(500).json({massage:'err.massage'});
         }
}
export async function deleteRoom(req: Request, res: Response) {
    try{
      const deletRoom=await RoomService.deleteRoomRequest(req.params.id);
      res.json(deletRoom);
    }
    catch(err){
      res.status(500).json({massage:'err.massage'});
    }
}
