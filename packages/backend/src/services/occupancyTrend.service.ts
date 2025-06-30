import {OccupancyTrend} from'../models/occupancyTrend';
import { supabase } from '../supabaseClient';
import { parse } from 'json2csv';
import fs from 'fs';
//כדי לראות את תמונת המצב
async function getAllTrends(id:any) {
  const { data, error } = await supabase
  .from('occupancy_trends')
  .select('*')
  .eq('roomId', id);  

if (error) {
  throw error;
}

return data;
}
  //דיווח תפוסה לפי סוג חלל עבודה ופרק זמן
  async function getSnapshotReport(body: any){
    const { workspaceType, startDate, endDate } = body;

    const { data, error } = await supabase
      .from('occupancy_snapshots')
      .select('*')
      .eq('BreakDown.workspaceType', workspaceType)
      .gte('date', startDate)
      .lte('date', endDate);
  
    if (error) {
      throw error;
    }
  
    return data;
}

//לעדכן-לבצע אופטומיזציה
async function updateTrend(id:any,updates: any) {  
  const { data, error } = await supabase
  .from('occupancy_trends')
  .update(updates)
  .eq('id', id);

if (error) {
  throw error;
}


return data;
}

//כדי ליצא ל-csv 
async function exportOccupancyTrendToCSV() {   
  const { data, error } = await supabase
  .from('occupancy_trends')
  .select('*');

if (error) {
  throw error;
}

const csv = parse(data);
fs.writeFileSync('occupancy_trends.csv', csv);

return 'CSV Exported Successfully'; 
}

//כדי לשמור את הנתונים הישנים בארכיון
async function archiveOldTrend() {
  const { data, error } = await supabase
    .from('occupancy_trends')
    .select('*')
    .lte('period.endDate', new Date().toISOString());

  if (error) throw error;

  const oldTrends = data ?? [];

  if (oldTrends.length === 0) {
    return 'No old trends to archive';
  }

  const { error: archiveError } = await supabase
    .from('occupancy_trends_archive')
    .insert(oldTrends);

  if (archiveError) throw archiveError;

  const ids = oldTrends.map((t: any) => t.id);

  const { error: deleteError } = await supabase
    .from('occupancy_trends')
    .delete()
    .in('id', ids);

  if (deleteError) throw deleteError;

  return 'Archived successfully';
}


//ניהול ללקוח שיש לו כמה משימות
async function calculateClientOccupancyTrend(customerId:any) {
  const { data: snapshots, error } = await supabase
    .from('occupancy_snapshots')
    .select('*')
    .eq('customerId', customerId);

  if (error) {
    throw error;
  }

  const total = snapshots.length;
  const avg = snapshots.reduce((sum:any, s:any) => sum + s.OccupancyRate, 0) / total;

  return {
    customerId,
    averageOccupancy: avg,
    totalSnapshots: total
  };
}
//במקרה שהחישוב יכשל 
async function calculateOccupancyRate(id:any) {
  const { data: trend, error } = await supabase
  .from('occupancy_trends')
  .select('*')
  .eq('id', id)
  .single();

if (error) {
  throw error;
}

const rate = trend.data.reduce((sum:any, item:any) => sum + item.occupancyRate, 0) / trend.data.length;

return {
  id,
  calculatedOccupancyRate: rate
};
}

//אינטגרציה עם סוגי לקוחות
async function integraionCustomer(customerId:any) {  
  const { data, error } = await supabase
  .from('customers')
  .update({ integrated: true })
  .eq('id', customerId);

if (error) {
  throw error;
}

return data;
}
//להקפיץ טריגר אם הקיבולת מתקרבת לסף
async function checkAndTriggerAlert(id:any) {
  const { data: trend, error } = await supabase
  .from('occupancy_trends')
  .select('*')
  .eq('id', id)
  .single();

if (error) {
  throw error;
}

const last = trend.data[trend.data.length - 1];
if (last.occupancyRate >= 0.8) {
  await supabase.from('occupancy_alerts').insert([{
    roomId: trend.roomId,
    customerId: trend.customerId,
    type: 'HighOccupancy',
    threshold: 0.8,
    currentValue: last.occupancyRate,
    workspaceType: 'MeetingRoom',
    isActive: true,
    triggeredAT: new Date().toISOString()
  }]);
}

return 'Checked and triggered if needed';
}

//במקרה של אי מסירת הודעות
async function sendOccupancyAlert(id:any) {  
  const { data: alert, error } = await supabase
  .from('occupancy_alerts')
  .select('*')
  .eq('id', id)
  .single();

if (error) {
  throw error;
}

if (alert.isActive) {
  console.log(`Sending alert for room ${alert.roomId}`);
}

return 'Alert sent';
}
module.exports={
    getAllTrends,
    updateTrend,
    exportOccupancyTrendToCSV,
    archiveOldTrend,
    calculateClientOccupancyTrend,
    getSnapshotReport,
    calculateOccupancyRate,
    integraionCustomer,
    checkAndTriggerAlert,
    sendOccupancyAlert
}