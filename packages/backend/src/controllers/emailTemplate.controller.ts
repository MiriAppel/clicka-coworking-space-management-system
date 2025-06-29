import { Request, Response } from 'express';
import { EmailTemplateService } from '../services/emailTemplate.service';
import { EmailTemplateModel } from '../models/emailTemplate.model';

export class EmailTemplateController {
    emailTemplateService = new EmailTemplateService();

    async getTemplates(req: Request, res: Response) {
        try {
            const templates = await this.emailTemplateService.getAllTemplates();
            res.json(templates);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async getTemplateById(req: Request, res: Response) {
        const templateId = req.params.id;
        try {
            const template = await this.emailTemplateService.getTemplateById(templateId);
            if (template) {
                res.json(template);
            } else {
                res.status(404).json({ error: "Template not found" });
            }
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async createTemplate(req: Request, res: Response) {
        const templateData = req.body;
        const template = new EmailTemplateModel(templateData);
        try {
            const createdTemplate = await this.emailTemplateService.createTemplate(template);
            res.status(201).json(createdTemplate);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async updateTemplate(req: Request, res: Response) {
        const templateId = req.params.id;
        const updatedData = req.body;
        const updatedTemplate = new EmailTemplateModel(updatedData);
        try {
            const result = await this.emailTemplateService.updateTemplate(templateId, updatedTemplate);
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ error: "Template not found" });
            }
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async deleteTemplate(req: Request, res: Response) {
        const templateId = req.params.id;
        try {
            const result = await this.emailTemplateService.deleteTemplate(templateId);
            if (result) {
                res.status(204).send(); // No content
            } else {
                res.status(404).json({ error: "Template not found" });
            }
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    // פונקציה לתצוגה מקדימה של תבנית דוא"ל כולל הזרקת והצגת משתנים בתבנית כולה
    async previewTemplate(req: Request, res: Response) {
        const templateId = req.params.id; // קבלת ה-ID של התבנית מהפרמטרים של הבקשה
        const dynamicVariables = req.body; // קבלת המשתנים הדינמיים מהגוף של הבקשה
        try {
            const preview = await this.emailTemplateService.previewTemplate(templateId, dynamicVariables); // קריאה לסרביס עם ה-ID והמשתנים
            if (preview) {
                console.log(preview); // מדפיסים את התוצאה ללוג
                res.json({ preview }); // מחזירים את התוצאה כתגובה
            } else {
                res.status(404).json({ error: "Template not found" }); // אם התבנית לא נמצאה
            }
        } catch (err) {
            res.status(500).json({ error: (err as Error).message }); // טיפול בשגיאות
        }
    }
}