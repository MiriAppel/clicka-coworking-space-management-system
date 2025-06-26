import {WorkspaceMapModel} from '../models/workspaceMap.model';
import { baseService } from './baseService';
export class WorkspaceMapService extends baseService<WorkspaceMapModel> {
    constructor() {
        super('WorkspaceMap');
    }
    

    }
//קבלת כל המפות הקיימות
// export async function getAllmaps(): Promise<WorkspaceMap[]> {
//   try {
//     const maps = await workspaceMapRepository.getAllMaps(); // פעולה שמביאה את כל המפות מהמסד נתונים
//     return maps;
//   } catch (error) {
//     console.error('Failed to fetch workspace maps:', error);
//     throw new Error('Could not retrieve workspace maps');
//   }

// }
// קבלת מפה לפי מזהה
export async function getWorkspaceMapById(id: any) { 
}

// יצירת מפה חדשה
export async function createWorkspaceMap(id: any) { 
}

// קבלת סביבת עבודה לפי מזהה
export async function getWorkspaceById(id: any) { 
}

// סינון מפה
export async function filterMap(id: any) { 
}

// עדכון פרטי מפה
export async function updateWorkspaceMap(id: any) { 
}

// מחיקת מפה
export async function deleteWorkspaceMap(id: any) { 
}

// יצירת סביבת עבודה חדשה
export async function createWorkspace(id: any) { 
}

// עדכון פרטי סביבת עבודה
export async function updateWorkspace(id: any) { 
}

// מחיקת סביבת עבודה
export async function deleteWorkspace(id: any) { 
}
   
    
