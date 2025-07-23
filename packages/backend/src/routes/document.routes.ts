import { Router } from 'express';
import multer from 'multer';
import { deleteDocuments, getDocumentByIdController, getVendorDocuments, uploadDocument } from '../controllers/document.controller';

const documentRouter = Router();
const upload = multer({ storage: multer.memoryStorage() }); // שמירת קובץ בזיכרון

documentRouter.post('/', upload.single('file'), uploadDocument);
documentRouter.get('/vendor/:vendorId', getVendorDocuments);
documentRouter.delete('/:documentId', deleteDocuments);
documentRouter.get('/id/:documentId', getDocumentByIdController);

export default documentRouter;
