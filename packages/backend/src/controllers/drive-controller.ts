import { Request, Response } from 'express';
import {
  uploadFileToDrive,
  fetchFileFromDrive,
  deleteFileFromDrive,
  shareDriveFile,
} from '../services/drive-service';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export async function uploadFile(req: MulterRequest, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Missing token' });

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Missing file' });

  try {
    const result = await uploadFileToDrive(file, token);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Error uploading file', details: error.message });
  }
}

export async function fetchFile(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const fileId = req.params.fileId;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const fileStream = await fetchFileFromDrive(fileId, token);
    fileStream.pipe(res);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching file', details: error.message });
  }
}

export async function deleteFile(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const fileId = req.params.fileId;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    await deleteFileFromDrive(fileId, token);
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ error: 'Error deleting file', details: error.message });
  }
}

export async function shareFile(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const fileId = req.params.fileId;
  const permissions = req.body;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    await shareDriveFile(fileId, permissions, token);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ error: 'Error sharing file', details: error.message });
  }
}
