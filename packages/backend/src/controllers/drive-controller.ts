import { Request, Response, NextFunction } from 'express';
import {
  uploadFileToDrive,
  fetchFileFromDrive,
  deleteFileFromDrive,
  shareDriveFile,
} from '../services/drive-service';

import {
  validateUploadFile,
  validateFileId,
  validateSharePermissions
} from '../utils/validateDriveInput';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return next({ status: 401, message: 'Missing token' });

  const file = req.file;
  if (!file) return next({ status: 400, message: 'Missing file' });

  try {
    validateUploadFile(req);
    const result = await uploadFileToDrive(file, token);
    res.status(201).json(result);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function fetchFile(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  const fileId = req.params.fileId;

  if (!token) return next({ status: 401, message: 'Missing token' });

  try {
    validateFileId(fileId);
    const fileStream = await fetchFileFromDrive(fileId, token);
    fileStream.pipe(res);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  const fileId = req.params.fileId;

  if (!token) return next({ status: 401, message: 'Missing token' });

  try {
    validateFileId(fileId);
    await deleteFileFromDrive(fileId, token);
    res.sendStatus(204);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function shareFile(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  const fileId = req.params.fileId;
  const permissions = req.body;

  if (!token) return next({ status: 401, message: 'Missing token' });

  try {
    validateFileId(fileId);
    await shareDriveFile(fileId, permissions, token);
    res.sendStatus(200);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}
