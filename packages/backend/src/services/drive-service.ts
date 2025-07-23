import { google } from 'googleapis';
import { FileReference } from 'shared-types';
import { Readable } from 'stream';
import { UserTokenService } from './userTokenService';

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}
//
// export async function uploadFileToDrive(
//   file: Express.Multer.File,
//   token: string
  
// ) {
//   const drive = google.drive({
//     version: 'v3',
//     auth: getAuth(token)

//   });
//   const res = await drive.files.create({
//     requestBody: {
//       name: file.originalname,
//     },

//     media: {
//       mimeType: file.mimetype,
//       body: Readable.from(file.buffer),
//     },
//   });
//   return res.data;
// }
//ללי
export async function uploadFileToDrive(
  file: Express.Multer.File, 
  token: string, 
  folderId?: string  // הוסיפי את הפרמטר הזה
) {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  
  const requestBody: any = {
    name: file.originalname,
  };
  
  // אם צוין מזהה תיקייה, הוסף אותו
  if (folderId) {
    requestBody.parents = [folderId];
  }
  
  const res = await drive.files.create({
    requestBody,
    media: {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    },
  });
  return res.data;
}
//ללי
// פונקציה שמקבלת path ומחזירה ID של התיקייה
export async function getOrCreateFolderIdByPath(
  folderPath: string, 
  token: string
): Promise<string> {
  console.log(`Getting folder ID for path: ${folderPath}`);
  
  // אם הנתיב ריק - החזר undefined (שורש)
  if (!folderPath || folderPath.trim() === '') {
    return 'root'; // או undefined אם את רוצה שורש
  }
  
  // פיצול הנתיב לחלקים
  const pathParts = folderPath.split('/').filter(part => part.trim() !== '');
  
  let currentFolderId: string | undefined = undefined;
  
  // עבור על כל חלק בנתיב
  for (const folderName of pathParts) {
    console.log(`Processing folder: ${folderName}`);
    
    // חפש או צור את התיקייה
    const folderId = await findFolderByName(folderName, token, currentFolderId);
    
    if (folderId) {
      console.log(`Found existing folder: ${folderName} with ID: ${folderId}`);
      currentFolderId = folderId;
    } else {
      console.log(`Creating new folder: ${folderName}`);
      currentFolderId = await createFolderInDrive(folderName, token, currentFolderId);
      console.log(`Created folder: ${folderName} with ID: ${currentFolderId}`);
    }
  }
  
  return currentFolderId!;
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

//פונקציות שהוספתי
// פונקציה לחיפוש תיקייה לפי שם
export async function findFolderByName(
  folderName: string, 
  token: string, 
  parentFolderId?: string
): Promise<string | null> {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  
  let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentFolderId) {
    query += ` and '${parentFolderId}' in parents`;
  }
  
  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
  });
  
  return res.data.files?.[0]?.id || null;
}
// פונקציה ליצירת תיקייה
export async function createFolderInDrive(
  folderName: string, 
  token: string, 
  parentFolderId?: string
): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });
  
  const requestBody: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  
  if (parentFolderId) {
    requestBody.parents = [parentFolderId];
  }
  
  const res = await drive.files.create({
    requestBody,
  });
  
  return res.data.id!;
}
// הפונקציה הראשית: מתרגמת path ל-ID
export async function getOrCreateFolderByPath(
  folderPath: string, 
  token: string
): Promise<string> {
  console.log(`Creating folder path: ${folderPath}`);
  
  // פיצול הנתיב לחלקים
  const pathParts = folderPath.split('/').filter(part => part.trim() !== '');
  
  let currentFolderId: string | undefined = undefined;
  
  // עבור על כל חלק בנתיב
  for (const folderName of pathParts) {
    console.log(`Looking for folder: ${folderName}`);
    
    // חפש את התיקייה
    let folderId = await findFolderByName(folderName, token, currentFolderId);
    
    // אם לא נמצאה, צור אותה
    if (!folderId) {
      folderId = await createFolderInDrive(folderName, token, currentFolderId);
      console.log(`Created folder: ${folderName} with ID: ${folderId}`);
    } else {
      console.log(`Found existing folder: ${folderName} with ID: ${folderId}`);
    }
    
    currentFolderId = folderId;
  }
  
  return currentFolderId!;
}

// פונקציה חדשה שמשלבת הכל
//
 export async function uploadFileToFolderPath(
  file: Express.Multer.File,
  token: string,
  folderPath: string
) {
  const drive = google.drive({ version: 'v3', auth: getAuth(token) });

  // שלב 1: קבל את ID של התיקייה
  const folderId = await getOrCreateFolderByPath(folderPath, token);

  // שלב 2: בדוק אם קובץ בשם זה כבר קיים בתיקייה
  const fileName = file.originalname.replace(/'/g, "\\'");
  const query = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;

  const existingFiles = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
  });

  if (existingFiles.data.files && existingFiles.data.files.length > 0) {
    const error: any = new Error('קובץ בשם זה כבר קיים בתיקייה');
    error.status = 409;
    throw error;
  }

  // שלב 3: העלה את הקובץ
  return await uploadFileToDrive(file, token, folderId);
}

// יצירת מופע של שירות לניהול טוקנים לצורך גישה למערכת (Google Drive וכד')
const tokenService = new UserTokenService();
//פונקציה שמחזירה אובייקט FileReference
export async function uploadFileAndReturnReference(
  file: Express.Multer.File,
  folderPath: string
): Promise<FileReference> {
//קבלת הטוקן מפונקציה
const token= await tokenService.getSystemAccessToken();
if (!token) {
  throw new Error('Missing system token');
}
if (!process.env.SYSTEM_EMAIL) {
    throw new Error('SYSTEM_EMAIL env var is missing');
}
  // 1. קבלת או יצירת התיקייה לפי הנתיב
  const folderId = await getOrCreateFolderByPath(folderPath, token??'');
  // 2. העלאת הקובץ ל־Drive
  const uploaded = await uploadFileToDrive(file, token??'', folderId);
  // 3. שליפת המטא-דאטה של הקובץ
  const metadata = await getFileMetadataFromDrive(uploaded.id!, token??'');
  // 4. יצירת קישור ניווט נוח (לקובץ בתוך התיקייה)
  const fileUrl = `https://drive.google.com/drive/u/0/folders/${folderId}`;
  // 5. בניית אובייקט מסוג FileReference
  const fileRef: FileReference = {
    id: uploaded.id!,
    name: metadata.name!,
    path: folderPath,
    mimeType: metadata.mimeType!,
    size: Number(metadata.size),
    url: fileUrl,
    googleDriveId: uploaded.id ?? undefined,
    createdAt: metadata.createdTime!,
    updatedAt: metadata.modifiedTime!,
  };
console.log('File uploaded and reference created:', fileRef);
  return fileRef;
}
