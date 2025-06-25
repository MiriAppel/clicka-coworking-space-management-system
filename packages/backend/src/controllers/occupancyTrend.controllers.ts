const trendService = require('../../services/workspace_traking/OccupancyTrendService');
import { Request,Response } from "express";
//כדי לראות את תמונת המצב
export async function  getAllTrends(req:any, res:any) {
    try {
      const trends =trendService.getAllTrends(req.params.id);
      res.json(trends);
    } catch (err:any) {
     res.status(500).json({message: err.message });
    }
  }
  //לעדכן-לבצע אופטומיזציה
  export async function  updateTrend(req:any, res:any){
    try {
      const updated =await trendService.updateTrend(req.params.id, req.body);
      if (!updated) {
         res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend updated', updated });
    } catch (err:any) {
       res.status(500).json({ message:err.message });
    }
  }
  //כדי ליצא ל-csv
  export async function exportOccupancyTrendToCSV(req:Request,res:Response) {
    try{
      const csv =await trendService.exportOccupancyTrendToCSV(req.body);
      if (!csv) {
        res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend updated', csv });
    }
    catch(err:any){
      res.status(500).json({message: err.message});
    }
  }
  //כדי לשמור את הנתונים הישנים בארכיון
  export async function archiveOldTrend(req:Request,res:Response) {
    try{
      const archion =await trendService.archiveOldTrend(req.body);
      if (!archion) {
         res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend updated', archion });
    }
    catch(err:any){
      res.status(500).json({message: err.message });
    }
  } 


 //דיווח תפוסה לפי סוג חלל עבודה ופרק זמן
export async function getSnapshotReport(req:Request,res:Response) {
  try{
    const result=await trendService.getSnapshotReport(req.body);
    res.json(result);
  }
  catch(err){
    res.status(500).json({ message: 'err.message' });
  }
}

//במקרה שהחישוב יכשל 
export async function calculateOccupancyRate(req:Request,res:Response) {
  try{
     const calculate=await trendService.calculateOccupancyRate(req.params.id);
     res.json(calculate);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
//ניהול ללקוח שיש לו כמה משימות
export async function calculateClientOccupancySnapshot(req:Request,res:Response){
  try{
const calculateclient=await trendService.calculateClientOccupancySnapshot(req.params.customerId);
res.json(calculateclient);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
//אינטגרציה עם סוגי לקוחות
export async function integraionCustomer(req:Request,res:Response){
  try{
    const integration=await trendService.integraionCustomer(req.params.customerId);
    res.json(integration);
  }
  catch(err){
    res.status(500).json({ error: 'error.message' });
  }
}
  //להקפיץ טריגר אם הקיבולת מתקרבת לסף
export async function  checkAndTriggerAlert(req: Request, res: Response) {
  try {
    const result = trendService.checkAndTriggerAlert(req.params.id);
    res.json(result)
  } catch (err:any) {
     res.status(500).json({ message: err.message });
  }
}
export async function sendOccupancyAlert(req:Request,res:Response) {
  try{
    const result=trendService.sendOccupancyAlert(req.body);
  res.json(result)
  }
  catch(err:any){
    res.status(500).json({massage:err.massage});
  }
}
export enum statusOccupancy{
  HIGH_OCCUPANCY='HIGH_OCCUPANCY',
  LOW_OCCUPANCY='Low_Occupancy',
  CAPACITY_REACHED='CAPACITY_REACHED'
}
export type TimePeriod = 'daily' | 'weekly' | 'monthly'; 
export type DateISO = string;
export type ID = string;
export enum WorkSpaceType{ }

  module.exports={
    getAllTrends,
    updateTrend,
    exportOccupancyTrendToCSV,
    archiveOldTrend,
    calculateClientOccupancySnapshot,
    getSnapshotReport,
    calculateOccupancyRate,
    integraionCustomer,
    checkAndTriggerAlert,
    sendOccupancyAlert
  };