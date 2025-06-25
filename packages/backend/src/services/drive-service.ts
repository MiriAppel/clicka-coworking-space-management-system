import { google } from 'googleapis';
import { Readable } from 'stream';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}

export async function uploadFileToDrive(file: Express.Multer.File, token: string) {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  const res = await drive.files.create({
    requestBody: {
      name: file.originalname,
    },
    media: {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer), 
    },
  });
  return res.data;
}

export async function getFileFromDrive(fileId: string, token: string): Promise<NodeJS.ReadableStream> {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  try {
    const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    return res.data as NodeJS.ReadableStream;
  } catch (error: any) {
    if (error.code === 404) {
      const notFound = new Error('File not found in Google Drive');
      (notFound as any).status = 404;
      throw notFound;
    }
    throw error;
  }
}

export async function getFileMetadataFromDrive(fileId: string, token: string) {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  const res = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size, createdTime, modifiedTime',
  });
  return res.data;
}


export async function deleteFileFromDrive(fileId: string, token: string): Promise<void> {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  await drive.files.delete({ fileId });
}

export async function shareDriveFile(fileId: string, permissions: any, token: string): Promise<void> {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  await drive.permissions.create({
    fileId,
    requestBody: permissions,
  });
}
