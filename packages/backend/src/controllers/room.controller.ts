import { Request, Response } from 'express';
import RoomService from '../services/room.service';

// ליצירת חדר
export async function createRoom(req: Request, res: Response) {
  try {
    const room = await RoomService.createRoom(req.body);
    res.json(room);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateRoom(req: Request, res: Response){
    try{
      const updateRoom=await RoomService.updateRoom(req.params.id);
      res.json(updateRoom);
    }
    catch(err:any){
       res.status(500).json({massage:err.message});
    }
}
export async function getRoom(req: Request, res: Response){
    try{
        const getRoom=await RoomService.getRoom(req.params.id);
        res.json(getRoom);
    }
    catch(err:any){
res.status(500).json({massage:err.massage});
    }
}
export async function getRooms(req: Request, res: Response){
    try{
        const getAll=await RoomService.getRooms(req.body);
        res.json(getAll)
    }
    catch(err:any){
        res.status(500).json({massage:err.massage});
         }
}
export async function deleteRoom(req: Request, res: Response) {
    try{
      const deletRoom=await RoomService.deleteRoom(req.params.id);
      res.json(deletRoom);
    }
    catch(err:any){
      res.status(500).json({massage:err.massage});
    }
}



