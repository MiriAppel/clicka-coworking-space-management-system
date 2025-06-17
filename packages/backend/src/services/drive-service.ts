import { google } from 'googleapis';

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
      body: Buffer.from(file.buffer),
    },
  });

  return res.data;
}

export async function fetchFileFromDrive(fileId: string, token: string): Promise<any> {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });

  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

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
