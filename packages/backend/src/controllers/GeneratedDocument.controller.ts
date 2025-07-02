import { Request, Response } from 'express';
import * as GeneratedDocumentService from '../services/GeneratedDocument.service';
import { DocumentTemplate, DocumentTemplateModel } from '../models/document.model';
import { ID } from 'shared-types';

/** 
 * יצירת תבנית מסמך חדשה - POST /api/documents/document_template
 */
export const createTemplate = async (req: Request, res: Response) => {
    console.log('🔍 createTemplate called');
    console.log('🔍 Request body:', JSON.stringify(req.body, null, 2));
    try {

        const {
            newDocuments,
            customer_id
        }: {
            newDocuments: DocumentTemplateModel,
            customer_id: ID
        } = req.body;
        console.log('🔍 newDocuments:', newDocuments);
        const newTemplate =  await GeneratedDocumentService.createDocumentTemplate(newDocuments, customer_id);
        console.log('✅ Template created:', newTemplate);
        res.status(201).json(newTemplate);
        console.log('✅ Template created:', newTemplate);


    } catch (error) {

        console.error('❌ Error in createTemplate:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to create template', details: errorMessage });
    }
};
/** 
 * שליפת כל התבניות - GET /api/documents/templates
 */
export const getAllTemplates = async (req: Request, res: Response) => {
    console.log('🔍 getAllTemplates called');
    try {
        console.log('🔍 Calling GeneratedDocumentService.getAllTemplates()');
        const templates = await GeneratedDocumentService.getAllTemplates();
        console.log('✅ Templates retrieved:', templates);
        res.json(templates);
    } catch (error) {
        console.error('❌ Error in getAllTemplates:', error);
        res.status(500).json({ error: 'Failed to get templates' });
    }
};

/** 
 * שליפת תבניות פעילות - GET /api/documents/document_template/active
 */
export const getActiveTemplates = async (req: Request, res: Response) => {
    console.log('🔍 getActiveTemplates called');
    try {
        const templates = await GeneratedDocumentService.getActiveDocumentTemplates();
        console.log('✅ Active templates retrieved:', templates);
        res.json(templates);
    } catch (error) {
        console.error('❌ Error in getActiveTemplates:', error);
        res.status(500).json({ error: 'Failed to get active templates' });
    }
};

/** 
 * עדכון תבנית - PUT /api/documents/templates/:id
 */
export const updateTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedTemplate = req.body;

        await GeneratedDocumentService.updateTemplate(id, updatedTemplate);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update template' });
    }
};

/** 
 * הפעלה/השבתה של תבנית - PATCH /api/documents/templates/:id/toggle
 */
export const toggleTemplateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await GeneratedDocumentService.toggleTemplateStatus(id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle template status' });
    }
};

/** 
 * מחיקת תבנית - DELETE /api/documents/templates/:id
 */
export const deleteTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await GeneratedDocumentService.deleteTemplate(id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete template' });
    }
};