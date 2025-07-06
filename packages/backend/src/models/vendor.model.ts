import { v4 as uuidv4 } from "uuid";
import type {
  DateISO,
  FileReference,
  ID,
  PaymentMethod,
  PaymentTerms,
  Vendor,
  VendorCategory,
  VendorStatus,
} from "shared-types";

export class VendorModel implements Vendor {
  id: ID;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: PaymentTerms;
  preferredPaymentMethod?: PaymentMethod;
  category?: VendorCategory;
  status?: VendorStatus;
  notes?: string;
  // documents?: FileReference[];
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params: {
    id?: ID;
    name: string;
    createdAt: DateISO;
    updatedAt: DateISO;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    tax_id?: string;
    payment_terms?: PaymentTerms;
    preferred_payment_method?: PaymentMethod;
    category?: VendorCategory;
    status?: VendorStatus;
    notes?: string;
    documents?: FileReference[];
  }) {
    this.id = params.id ?? uuidv4(); // אם אין id - נייצר UUID חדש
    this.name = params.name;
    this.contactName = params.contact_name;
    this.phone = params.phone;
    this.email = params.email;
    this.address = params.address;
    this.website = params.website;
    this.taxId = params.tax_id;
    this.paymentTerms = params.payment_terms;
    this.preferredPaymentMethod = params.preferred_payment_method;
    this.category = params.category;
    this.status = params.status;
    this.notes = params.notes;
    // this.documents = params.documents;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
      contact_name: this.contactName,
      phone: this.phone,
      email: this.email,
      address: this.address,
      website: this.website,
      tax_id: this.taxId,
      payment_terms: this.paymentTerms,
      preferred_payment_method: this.preferredPaymentMethod,
      category: this.category,
      status: this.status,
      notes: this.notes,
      // documents: this.documents,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
