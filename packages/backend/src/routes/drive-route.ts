import { Router } from 'express';
import multer from 'multer';
import {
  postFile,
  getFile,
  deleteFile,
  shareFile,
  getFileMetadata 
} from '../controllers/drive-controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/v3/files/:fileId/metadata', getFileMetadata); // ← להוסיף את זה
router.get('/v3/files/:fileId', getFile);
router.post('/v3/files', upload.single('file'), postFile);
router.delete('/v3/files/:fileId', deleteFile);
router.post('/v3/files/:fileId/permissions', shareFile);

export default router;