import { Request, Response } from 'express';
 import { DocumentService, CreateDocumentTemplateRequest, UpdateDocumentTemplateRequest } from '../services/document.service';
import { DocumentType } from '../models/document.model';
import { ID } from 'shared-types';
//import { ID } from '../../../../types/core';

export class DocumentController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  // יצירת תבנית מסמך חדשה
  createTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const templateData: CreateDocumentTemplateRequest = req.body;
      const template = await this.documentService.createTemplate(templateData);
      
      res.status(201).json({
        success: true,
        message: 'תבנית המסמך נוצרה בהצלחה',
        data: template
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה ביצירת תבנית מסמך',
        data: null
      });
    }
  };

  // שליפת תבנית לפי מזהה
  getTemplateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const template = await this.documentService.getTemplateById(id as ID);
      
      res.status(200).json({
        success: true,
        message: 'תבנית המסמך נמצאה בהצלחה',
        data: template
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'תבנית המסמך לא נמצאה',
        data: null
      });
    }
  };

  // שליפת כל התבניות
  getAllTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await this.documentService.getAllTemplates();
      
      res.status(200).json({
        success: true,
        message: 'תבניות המסמכים נשלפו בהצלחה',
        data: templates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה בשליפת תבניות מסמכים',
        data: null
      });
    }
  };

  // שליפת תבניות לפי סוג
  getTemplatesByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      
      // בדיקה שהסוג תקין
      if (!Object.values(DocumentType).includes(type as DocumentType)) {
        res.status(400).json({
          success: false,
          message: 'סוג מסמך לא תקין',
          data: null
        });
        return;
      }

      const templates = await this.documentService.getTemplatesByType(type as DocumentType);
      
      res.status(200).json({
        success: true,
        message: `תבניות מסוג ${type} נשלפו בהצלחה`,
        data: templates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה בשליפת תבניות לפי סוג',
        data: null
      });
    }
  };
  // שליפת תבניות פעילות
  getActiveTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await this.documentService.getActiveTemplates();
      
      res.status(200).json({
        success: true,
        message: 'תבניות פעילות נשלפו בהצלחה',
        data: templates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה בשליפת תבניות פעילות',
        data: null
      });
    }
  };

  // עדכון תבנית
  updateTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdateDocumentTemplateRequest = req.body;
      
      const updatedTemplate = await this.documentService.updateTemplate(id as ID, updateData);
      
      res.status(200).json({
        success: true,
        message: 'תבנית המסמך עודכנה בהצלחה',
        data: updatedTemplate
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה בעדכון תבנית מסמך',
        data: null
      });
    }
  };

  // מחיקת תבנית
  deleteTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.documentService.deleteTemplate(id as ID);
      
      res.status(200).json({
        success: true,
        message: 'תבנית המסמך נמחקה בהצלחה',
        data: null
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה במחיקת תבנית מסמך',
        data: null
      });
    }
  };

  // שליפת תבנית ברירת מחדל לפי סוג
  getDefaultTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      
      // בדיקה שהסוג תקין
      if (!Object.values(DocumentType).includes(type as DocumentType)) {
        res.status(400).json({
          success: false,
          message: 'סוג מסמך לא תקין',
          data: null
        });
        return;
      }

      const template = await this.documentService.getDefaultTemplate(type as DocumentType);
      
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'לא נמצאה תבנית ברירת מחדל לסוג זה',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'תבנית ברירת מחדל נמצאה בהצלחה',
        data: template
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה בשליפת תבנית ברירת מחדל',
        data: null
      });
    }
  };

  // הפעלה/השבתה של תבנית
  toggleTemplateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedTemplate = await this.documentService.toggleTemplateStatus(id as ID);
      
      res.status(200).json({
        success: true,
        message: `תבנית המסמך ${updatedTemplate.active ? 'הופעלה' : 'הושבתה'} בהצלחה`,
        data: updatedTemplate
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'שגיאה בשינוי סטטוס תבנית',
        data: null
      });
    }
  };
  
}