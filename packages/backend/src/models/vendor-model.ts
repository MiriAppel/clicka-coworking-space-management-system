
import { ID, DateISO, FileReference } from '../../../../types/core';
import { Vendor, PaymentMethod, VendorCategory, VendorStatus, PaymentTerms } from '../../../../types/expense';

export class VendorModel implements Vendor {
  id: ID;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  tax_id?: string;
  //הוספת enum סוג התשלום שהספק דורש
  payment_terms?: PaymentTerms;
  preferred_payment_method?: PaymentMethod;
  category?: VendorCategory;
  status?: VendorStatus;
  notes?: string;
  documents?: FileReference[];
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params: {
    id: ID;
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
    this.id = params.id;
    this.name = params.name;
    this.contact_name = params.contact_name;
    this.phone = params.phone;
    this.email = params.email;
    this.address = params.address;
    this.website = params.website;
    this.tax_id = params.tax_id;
    this.payment_terms = params.payment_terms;
    this.preferred_payment_method = params.preferred_payment_method;
    this.category = params.category;
    this.status = params.status;
    this.notes = params.notes;
    this.documents = params.documents;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
      contact_name: this.contact_name,
      phone: this.phone,
      email: this.email,
      address: this.address,
      website: this.website,
      tax_id: this.tax_id,
      payment_terms: this.payment_terms,
      preferred_payment_method: this.preferred_payment_method,
      category: this.category,
      status: this.status,
      notes: this.notes,
      documents: this.documents,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}