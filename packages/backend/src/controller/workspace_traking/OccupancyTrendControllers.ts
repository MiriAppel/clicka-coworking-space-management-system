const trendService = require('../../services/workspace_traking/OccupancyTrendService');
import { Request,response } from "express";
//כדי לזהות מגמת תפוסה
export async function  getAllTrends(req:any, res:any) {
    try {
      const trends =trendService.getAllTrends(req.params.id);
      res.json(trends);
    } catch (err) {
     res.status(500).json({message: "err.message" });
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
    } catch (err) {
       res.status(500).json({ message:"err.message" });
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
    catch(err){
      res.status(500).json({message: "err.message "});
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
    catch(err){
      res.status(500).json({message: "err.message "});
    }
  }
  //ניהול ללקוח שיש לו כמה משימות
  export async function calculateClientOccupancyT(req:Request,res:Response) {
    try{
      const calculateclient =await trendService.exportOccupancyTrendToCSV(req.params.customerId);
      if (!calculateclient) {
        return res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend calculateclient', calculateclient });
    }
    catch(err){
      res.status(500).json({message: "err.message "});
    }
  }
  module.exports={
    getAllTrends,
    updateTrend,
    exportOccupancyTrendToCSV,
    archiveOldTrend,
    calculateClientOccupancyT
}