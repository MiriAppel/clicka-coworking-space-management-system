import { Router } from 'express';
import multer from 'multer';
import {
  postFile,
  getFile,
  deleteFile,
  shareFile,
  getFileMetadata
} from '../controllers/drive-controller';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // תיקון קידוד UTF-8 לשמות קבצים בעברית
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  }
});
const driveRouter = Router();

// בלי as any - אמור לעבוד עכשיו!
driveRouter.get('/v3/files/:fileId/metadata', getFileMetadata);
driveRouter.get('/v3/files/:fileId', getFile);
driveRouter.post('/v3/files', upload.single('file'), postFile);
driveRouter.delete('/v3/files/:fileId', deleteFile);
driveRouter.post('/v3/files/:fileId/permissions', shareFile);

// נתיב העלאה נוסף
driveRouter.post('/upload', upload.single('file'), postFile);

export default driveRouter;
