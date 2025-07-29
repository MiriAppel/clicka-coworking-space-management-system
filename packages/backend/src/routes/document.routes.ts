import { Router } from 'express';
<<<<<<< HEAD
import { DocumentController } from '../controllers/document.controller';

const router = Router();
const documentController = new DocumentController();

// ==================== TEMPLATE ROUTES ====================

// יצירת תבנית חדשה
router.post('/', documentController.createTemplate);

// שליפת כל התבניות
router.get('/', documentController.getAllTemplates);

// שליפת תבניות פעילות בלבד
router.get('/active', documentController.getActiveTemplates);

// שליפת תבנית לפי מזהה
router.get('/:id', documentController.getTemplateById);

// שליפת תבניות לפי סוג
router.get('/type/:type', documentController.getTemplatesByType);

// שליפת תבנית ברירת מחדל לפי סוג
router.get('/default/:type', documentController.getDefaultTemplate);

// עדכון תבנית
router.put('/:id', documentController.updateTemplate);

// הפעלה/השבתה של תבנית
router.patch('/:id/toggle-status', documentController.toggleTemplateStatus);

// מחיקת תבנית
router.delete('/:id', documentController.deleteTemplate);

export default router;
=======
import multer from 'multer';
import { deleteDocuments, getDocumentByIdController, getVendorDocuments, saveDocuments, uploadDocument } from '../controllers/document.controller';

const documentRouter = Router();
const upload = multer({ storage: multer.memoryStorage() }); // שמירת קובץ בזיכרון

documentRouter.post('/', upload.single('file'), uploadDocument);
documentRouter.get('/vendor/:vendorId', getVendorDocuments);
documentRouter.delete('/:documentId', deleteDocuments);
documentRouter.get('/id/:documentId', getDocumentByIdController);
documentRouter.post('/save', upload.single('file'), saveDocuments);


export default documentRouter;
>>>>>>> ce4631774996556b75702ebbab2f7b3b6635c0c1
