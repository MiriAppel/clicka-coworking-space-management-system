import { Request, Response } from 'express';
import { createDocument, deleteDocument, getDocumentById, getVendorDocument } from '../services/document.service';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const vendorId = req.body.vendor_id?.trim();
    const name = req.body.name?.trim();
    const file = req.file;

    if (!file || !vendorId || !name) {
      return res.status(400).json({ error: 'חסרים שדות חובה: קובץ, vendor_id או name' });
    }

    const docParams = {
      name,
      path: '', // תעדכני לפי הצורך
      mimeType: file.mimetype,
      size: file.size,
      url: '', // תעדכני עם כתובת אמיתית בעתיד
      googleDriveId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: '', // אופציונלי
    };

    const newDoc = await createDocument(docParams, vendorId);

    return res.status(201).json(newDoc);
  } catch (error: any) {
    console.error('שגיאה בהעלאת מסמך:', error);
    return res.status(500).json({ error: error.message });
  }
};
// קריאת מסמכים של ספק
export const getVendorDocuments = async (req: Request, res: Response) => {
  const vendorId = req.params.vendorId;

  try {
    const documents = await getVendorDocument(vendorId);
    res.status(200).json(documents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// פונקציה למחיקת מסמך לפי ID והסרתו מהספק
export const deleteDocuments = async (req: Request, res: Response) => {
  const documentId = req.params.documentId;
  if (!documentId) {
    return res.status(400).json({ error: 'Missing documentId in params' });
  }
  try {
    const result = await deleteDocument(documentId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getDocumentByIdController = async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const document = await getDocumentById(documentId);
    res.status(200).json(document);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};