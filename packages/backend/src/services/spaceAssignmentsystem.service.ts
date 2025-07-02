
import { createClient } from '@supabase/supabase-js';
import { RoomModel } from "../models/room.model";
import type { ID } from "shared-types";
import dotenv from 'dotenv';
import { SpaceAssignmentModel } from '../models/spaceAssignment.model';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

function logUserActivity(userId: string, action: string) {
  console.log(`[Activity Log] ${userId}: ${action}`);
}
//יצירת מרחב
export class SpaceAssignmentService {
async  createSpace(space: SpaceAssignmentModel): Promise<SpaceAssignmentModel | null> {
        console.log('📦 Inserting space:', space.toDatabaseFormat());
        const { data, error } = await supabase
          .from('space_assignment') 
          .insert([space.toDatabaseFormat()])
          .select()
          .single();
    
    
       if (error) {
      console.log('❌ Supabase Insert Error:', error); 
    throw new Error(`Failed to create space: ${error.message}`);
      }
    
        const createdspace = SpaceAssignmentModel.fromDatabaseFormat(data);
        //logUserActivity(room.id ?? room.name, 'book created');
        return createdspace;
}
//קבלת כל המרחבים
//החזרת כל המרחבים מהמסד נתונים

      async getAllSpaces() {
    try {
      const { data, error } = await supabase
        .from('space_assignment') // שם הטבלה שלך ב-Supabase
        .select('*');

      if (error) {
        console.error('Supabase error:', error.message);
        return null;
      }
 const createdspace = SpaceAssignmentModel.fromDatabaseFormatArray(data)
      return createdspace;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }

//עדכון מרחב
      async updateSpace(id: string, updatedData: SpaceAssignmentModel): Promise<SpaceAssignmentModel | null> {
    
        const { data, error } = await supabase
            .from('space_assignment')
            .update([updatedData.toDatabaseFormat()])
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating space:', error);
            return null;
        }
        const space = SpaceAssignmentModel.fromDatabaseFormat(data);
        //logUserActivity(feature.description, 'feature updated');
       
        return space; 
}
//מחיקת מרחב
async  deleteSpace(id:string) {
            const { error } = await supabase
            .from('space_assignment')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting space:', error);
            return false;
        }
        
       // logUserActivity(id, 'User deleted');
      
        return true; 
}

//קבלת  מרחב לפי ID
async  getSpaceById(id:string) {
         const { data, error } = await supabase
                .from('space_assignment')
                .select('*')
                .eq('id', id)
                .single();
    
            if (error) {
                console.error('Error fetching space:', error);
                return null;
            }
    
            const space = SpaceAssignmentModel.fromDatabaseFormat(data); 
         
            return space;
}

}