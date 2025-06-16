import { error } from 'console';
import occupancySnapshotService from'../../services/workspace_traking/OccupancySnapshotService';
import { Request, Response } from 'express';

//כדי לראות את תמונת המצב
export async function  getAllSnapshotsreq(req: Request, res: Response) {
  try {
    const snapshots =await occupancySnapshotService.getAllSnapshots(req.body);
    res.json(snapshots);
  } catch (err) {
     res.status(500).json({ message: 'err.message' });
  }
}
 //דיווח תפוסה לפי סוג חלל עבודה ופרק זמן
export async function getSnapshotReport(req:Request,res:Response) {
  try{
    const result=await occupancySnapshotService.getSnapshotReport(req.body);
    res.json(result);
  }
  catch(err){
    res.status(500).json({ message: 'err.message' });
  }
}

//כדי ליצא ל-csv 
export async function exportOccupancySnapshots(req: Request, res: Response) {
  try {
    const csv = await occupancySnapshotService.exportOccupancySnapshotsToCSV(req.body);
    res.json(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
//כדי לשמור את הנתונים הישנים בארכיון
export async function archiveOldSnapshots(req:Request,res:Response) {
  try{
const archion=await occupancySnapshotService.archiveOldSnapshots(req.body);
res.jsonp(archion);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
//במקרה שהחישוב יכשל 
export async function calculateOccupancyRate(req:Request,res:Response) {
  try{
     const calculate=await occupancySnapshotService.calculateOccupancyRate(req.params.id);
     res.json(calculate);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
//ניהול ללקוח שיש לו כמה משימות
export async function calculateClientOccupancyS(req:Request,res:Response){
  try{
const calculateclient=await occupancySnapshotService.calculateClientOccupancyS(req.params.customerId);
res.json(calculateclient);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
//אינטגרציה עם סוגי לקוחות
export async function integraionCustomer(req:Request,res:Response){
  try{
    const integration=await occupancySnapshotService.integraionCustomer(req.params.customerId);
    res.json(integration);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
module.exports= {
  getAllSnapshotsreq,
  getSnapshotReport,
  exportOccupancySnapshots,
  archiveOldSnapshots,
  calculateOccupancyRate,
  calculateClientOccupancyS,
  integraionCustomer
}