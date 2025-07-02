import { Router } from 'express';
import * as controllerDocumen from '../controllers/GeneratedDocument.controller';

const router = Router();

// הוספת debug
console.log('GeneratedDocument routes loaded');

router.post('/document_template', controllerDocumen.createTemplate);
router.get('/document_template', controllerDocumen.getAllTemplates);
router.get('/document_template/active', controllerDocumen.getActiveTemplates);
router.put('/document_template/:id', controllerDocumen.updateTemplate);
router.patch('/document_template/:id/toggle', controllerDocumen.toggleTemplateStatus);
router.delete('/document_template/:id', controllerDocumen.deleteTemplate);

export default router;