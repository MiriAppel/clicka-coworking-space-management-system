import { Router } from 'express';
import multer from 'multer';
import {
  uploadFile,
  fetchFile,
  deleteFile,
  shareFile
} from '../controllers/drive-controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload/drive/v3/files', upload.single('file'), uploadFile);
router.get('/drive/v3/files/:fileId', fetchFile);
router.delete('/drive/v3/files/:fileId', deleteFile);
router.post('/drive/v3/files/:fileId/permissions', shareFile);

export default router;
