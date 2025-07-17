import { Router } from 'express';
import multer from 'multer';
import {
  postFile,
  getFile,
  deleteFile,
  shareFile,
  getFileMetadata,
  uploadFile
} from '../controllers/drive-controller';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // תיקון קידוד UTF-8 לשמות קבצים בעברית
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  }
});
const driveRoutes = Router();

// בלי as any - אמור לעבוד עכשיו!
driveRoutes.get('/v3/files/:fileId/metadata', getFileMetadata);
driveRoutes.get('/v3/files/:fileId', getFile);
driveRoutes.post('/v3/files', upload.single('file'), postFile);
driveRoutes.delete('/v3/files/:fileId', deleteFile);
driveRoutes.post('/v3/files/:fileId/permissions', shareFile);

// נתיב העלאה נוסף
driveRoutes.post('/upload', upload.single('file'), postFile);
// העלאת קובץ (עם קובץ multipart ושדה folderPath בגוף)
driveRoutes.post('/v3/files', upload.single('file'), uploadFile);

export default driveRoutes;