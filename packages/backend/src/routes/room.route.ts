import  express  from "express";
import * as RoomController from '../controllers/room.controller';

const router=express.Router();

router.get('/:id', RoomController.getRoom);
router.get('/',RoomController.getRooms);
router.post('/', RoomController.createRoom);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);


export default router;