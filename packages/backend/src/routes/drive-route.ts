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

router.post('/v3/files', upload.single('file'), uploadFile);
router.get('/v3/files/:fileId', fetchFile);
router.delete('/v3/files/:fileId', deleteFile);
router.post('/v3/files/:fileId/permissions', shareFile);

export default router;