import { Request,Response } from 'express';
import alertService from'../services/occupancyAlertService';
//להקפיץ טריגר אם הקיבולת מתקרבת לסף
export async function  checkAndTriggerAlert(req: Request, res: Response) {
  try {
    const result = alertService.checkAndTriggerAlert(req.params.id);
    res.json(result)
  } catch (err) {
     res.status(500).json({ message: "err.message" });
  }
}
export async function exportOccupancyAlertToCSV(req:Request,res:Response) {
  try{
    const result=alertService.exportOccupancyAlertToCSV(req.body);
    res.json(result);
  }
  catch(err){
   res.status(500).json({massage:'err.massage'});
  }
}
export async function archiveOldAlert(req:Request,res:Response) {
  try{
    const result=alertService.archiveOldAlert(req.body);
    res.json(result);
  }
  catch(err){
    res.status(500).json({massage:'err.massage'});
  }
}
export async function sendOccupancyAlert(req:Request,res:Response) {
  try{
    const result=alertService.sendOccupancyAlert(req.body);
  res.json(result)
  }
  catch(err){
    res.status(500).json({massage:'err.massage'});
  }
}

module.exports = {
  checkAndTriggerAlert,
  exportOccupancyAlertToCSV,
  archiveOldAlert,
  sendOccupancyAlert
};
