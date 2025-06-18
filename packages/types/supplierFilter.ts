import { VendorCategory ,VendorStatus} from './expense';
export interface SupplierFilter {
  name?: string; // חיפוש לפי שם ספק
  category?: VendorCategory; // סינון לפי קטגוריה
  status?: VendorStatus; // סינון לפי סטטוס
}