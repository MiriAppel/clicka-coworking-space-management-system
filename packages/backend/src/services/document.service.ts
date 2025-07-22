import { supabase } from '../db/supabaseClient';
import { DocumentModel } from '../models/document.model';

// יצירת מסמך ושמירתו בטבלת vendor (שדה document_ids)
// 1. הוספה לטבלת documents
export const createDocument = async (docParams: any, vendorId: string) => {
  // 1. יצירת המסמך בטבלה document
  const documentModel = new DocumentModel(docParams);
  const { data: documentData, error: documentError } = await supabase
    .from('document')
    .insert([documentModel.toDatabaseFormat()])
    .select()
    .single();

  console.log('documentData:', documentData);
  console.log('documentError:', documentError);

  if (documentError) throw new Error(documentError.message);

  // 2. קבלת המערך הנוכחי של document_ids מהוונדור
  const { data: vendorData, error: vendorFetchError } = await supabase
    .from('vendor')
    .select('document_ids')
    .eq('id', vendorId)
    .single();

  console.log('vendorData:', vendorData);
  console.log('vendorFetchError:', vendorFetchError);

  if (vendorFetchError) throw new Error(vendorFetchError.message);

  const currentDocs = vendorData?.document_ids || [];
  const updatedDocs = [...currentDocs, documentData.id];

  console.log('updatedDocs:', updatedDocs);

  // 3. עדכון הוונדור עם המערך החדש
  const { error: vendorUpdateError } = await supabase
    .from('vendor')
    .update({ document_ids: updatedDocs })
    .eq('id', vendorId);

  console.log('vendorUpdateError:', vendorUpdateError);

  if (vendorUpdateError) throw new Error(vendorUpdateError.message);

  return {
    document: DocumentModel.fromDatabaseFormat(documentData),
    updatedDocs,
  };
};
export const getVendorDocument = async (vendorId: string) => {
  // שלב 1: שליפת מערך המסמכים של הספק
  const { data: vendor, error: vendorError } = await supabase
    .from('vendor')
    .select('document_ids')
    .eq('id', vendorId)
    .single();

  if (vendorError) throw new Error(vendorError.message);

  const documentIds = vendor?.document_ids || [];

  // שלב 2: שליפת המסמכים עצמם
  const { data: documents, error: docsError } = await supabase
    .from('document')
    .select('*')
    .in('id', documentIds);

  if (docsError) throw new Error(docsError.message);

  return documents;
};
// מחיקת מסמך מטבלת document והסרתו ממערך document_ids של ספק

// מחיקת מסמך לפי id ועדכון vendor
export const deleteDocument = async (documentId: string) => {
  // 1. מציאת הספק שכולל את המסמך במערך document_ids
  const { data: vendors, error: vendorFetchError } = await supabase
    .from('vendor')
    .select('id, document_ids')
    .contains('document_ids', [documentId]);

  if (vendorFetchError) throw new Error(vendorFetchError.message);
  if (!vendors || vendors.length === 0) throw new Error('Vendor not found for this document');

  const vendor = vendors[0];  // לקיחת הספק הראשון מהרשימה
  const vendorId = vendor.id;
  const currentDocs = vendor.document_ids || [];

  // 2. הסרת ה-documentId מהמערך
  const updatedDocs = currentDocs.filter((id: string) => id !== documentId);

  // 3. עדכון טבלת vendor עם המערך החדש
  const { error: vendorUpdateError } = await supabase
    .from('vendor')
    .update({ document_ids: updatedDocs })
    .eq('id', vendorId);

  if (vendorUpdateError) throw new Error(vendorUpdateError.message);

  // 4. מחיקת המסמך מטבלת document
  const { error: documentDeleteError } = await supabase
    .from('document')
    .delete()
    .eq('id', documentId);

  if (documentDeleteError) throw new Error(documentDeleteError.message);

  return { message: 'Document deleted and vendor updated successfully' };
};
export const getDocumentById = async (documentId: string) => {
  const { data, error } = await supabase
    .from('document')
    .select('*')
    .eq('id', documentId);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Document not found');

  return data[0];  // מחזיר את המסמך היחיד
};