import { ID, DateISO } from 'shared-types';
import {
  DocumentTemplateModel,
  DocumentType
} from '../models/document.model';
import { 
  getAllDocumentTemplates,
  getActiveDocumentTemplates,
  createDocumentTemplate,
  updateDocumentTemplate,
  deleteDocumentTemplate,
  getDocumentTemplateById,
  getDocumentTemplatesByType
} from './GeneratedDocument.service'; // ייבוא מהשירות השני
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || ""; // שימי לב לשם המדויק
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "חסרים ערכים ל־SUPABASE_URL או SUPABASE_SERVICE_KEY בקובץ הסביבה"
  );
}
const supabase = createClient(supabaseUrl, supabaseKey);
//import { ID } from '../../../../types/core';
export interface CreateDocumentTemplateRequest {
  name: string;
  type: DocumentType;
  language: 'hebrew' | 'english';
  template: string;
  variables: string[];
  isDefault?: boolean;
  active?: boolean;
}

export interface UpdateDocumentTemplateRequest {
  name?: string;
  type?: DocumentType;
  language?: 'hebrew' | 'english';
  template?: string;
  variables?: string[];
  isDefault?: boolean;
  active?: boolean;
}

export class DocumentService {
  createDocumentTemplate(newDocuments: DocumentTemplateModel, customer_id: string) {
    throw new Error('Method not implemented.');
  }
  static updateTemplate(id: string, updatedTemplate: any) {
    throw new Error('Method not implemented.');
  }
  // יצירת תבנית מסמך חדשה
  async createTemplate(data: DocumentTemplateModel, customer_id: ID): Promise<DocumentTemplateModel> {
    try {
      // בדיקת תקינות נתונים
      if (!data.id || !data.template) {
        throw new Error('שם התבנית והתוכן הם שדות חובה');
      }

      // אם זו תבנית ברירת מחדל, נבטל את כל התבניות האחרות מאותו סוג
      // if (data.isDefault) {
      //   await this.unsetDefaultTemplates(data.type);
      // }

      const template = await createDocumentTemplate(data, customer_id);
      return template;
    } catch (error) {
      throw new Error(`שגיאה ביצירת תבנית מסמך: ${error}`);
    }
  }

  // שליפת תבנית לפי מזהה
  async getTemplateById(id: ID): Promise<DocumentTemplateModel> {
    try {
      const template = await getDocumentTemplateById(id);
      if (!template) {
        throw new Error('תבנית המסמך לא נמצאה');
      }
      return template;
    } catch (error) {
      throw new Error(`שגיאה בשליפת תבנית מסמך: ${error}`);
    }
  }

  // שליפת כל התבניות
  async getAllTemplates(): Promise<DocumentTemplateModel[]> {
    try {
      return await getAllDocumentTemplates();
    } catch (error) {
      throw new Error(`שגיאה בשליפת תבניות מסמכים: ${error}`);
    }
  }

  // שליפת תבניות לפי סוג
  async getTemplatesByType(type: DocumentType): Promise<DocumentTemplateModel[]> {
    try {
      return await getDocumentTemplatesByType(type);
    } catch (error) {
      throw new Error(`שגיאה בשליפת תבניות לפי סוג: ${error}`);
    }
  }

  // שליפת תבניות פעילות בלבד
  async getActiveTemplates(): Promise<DocumentTemplateModel[]> {
    try {
      return await getActiveDocumentTemplates();
    } catch (error) {
      throw new Error(`שגיאה בשליפת תבניות פעילות: ${error}`);
    }
  }

 // עדכון תבנית
  async updateTemplate(id: ID, data: UpdateDocumentTemplateRequest): Promise<DocumentTemplateModel> {
    try {
      // אם מעדכנים לתבנית ברירת מחדל, נבטל את האחרות
      if (data.isDefault && data.type) {
        await this.unsetDefaultTemplates(data.type);
      }

      const updatedTemplate = await updateDocumentTemplate(id, data);
      if (!updatedTemplate) {
        throw new Error('תבנית המסמך לא נמצאה לעדכון');
      }
      return updatedTemplate;
    } catch (error) {
      throw new Error(`שגיאה בעדכון תבנית מסמך: ${error}`);
    }
  }
  unsetDefaultTemplates(type: DocumentType) {
    throw new Error('Method not implemented.');
  }

  // מחיקת תבנית
  async deleteTemplate(id: ID): Promise<void> {
    try {
      const success = await deleteDocumentTemplate(id);
      if (!success) {
        throw new Error('תבנית המסמך לא נמצאה למחיקה');
      }
    } catch (error) {
      throw new Error(`שגיאה במחיקת תבנית מסמך: ${error}`);
    }
  }

  // שליפת תבנית ברירת מחדל לפי סוג
  async getDefaultTemplate(type: DocumentType): Promise<DocumentTemplateModel | null> {
    try {
      const templates = await getDocumentTemplatesByType(type);
      return templates.find((template: { isDefault: any; active: any; }) => template.isDefault && template.active) || null;
    } catch (error) {
      throw new Error(`שגיאה בשליפת תבנית ברירת מחדל: ${error}`);
    }
  }

  // ביטול ברירת מחדל לכל התבניות מסוג מסוים
  // private async unsetDefaultTemplates(type: DocumentType): Promise<void> {
  //   const templates = await getDocumentTemplatesByType(type);
  //   for (const template of templates) {
  //     if (template.isDefault) {
  //       await updateDocumentTemplate(template.id, { isDefault: false });
  //     }
  //   }
  // }

  // הפעלה/השבתה של תבנית
  async toggleTemplateStatus(id: ID): Promise<DocumentTemplateModel> {
    try {
      const template = await getDocumentTemplateById(id);
      if (!template) {
        throw new Error('תבנית המסמך לא נמצאה');
      }

      const updatedTemplate = await updateDocumentTemplate(id, { active: !template.active });
      if (!updatedTemplate) {
        throw new Error('שגיאה בעדכון סטטוס התבנית');
      }
      return updatedTemplate;
    } catch (error) {
      throw new Error(`שגיאה בשינוי סטטוס תבנית: ${error}`);
    }
  }
}