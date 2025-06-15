import { ID, DateISO, FileReference } from '../types/core';
import { Vendor, PaymentMethod, VendorCategory, VendorStatus } from '../types/expense';

export class VendorModel implements Vendor {
  id: ID;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  preferredPaymentMethod?: PaymentMethod;
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
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    taxId?: string;
    paymentTerms?: string;
    preferredPaymentMethod?: PaymentMethod;
    category?: VendorCategory;
    status?: VendorStatus;
    notes?: string;
    documents?: FileReference[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.contactName = params.contactName;
    this.phone = params.phone;
    this.email = params.email;
    this.address = params.address;
    this.website = params.website;
    this.taxId = params.taxId;
    this.paymentTerms = params.paymentTerms;
    this.preferredPaymentMethod = params.preferredPaymentMethod;
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
      contactName: this.contactName,
      phone: this.phone,
      email: this.email,
      address: this.address,
      website: this.website,
      taxId: this.taxId,
      paymentTerms: this.paymentTerms,
      preferredPaymentMethod: this.preferredPaymentMethod,
      category: this.category,
      status: this.status,
      notes: this.notes,
      documents: this.documents,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}