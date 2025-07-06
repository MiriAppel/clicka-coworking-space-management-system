import * as fs from 'fs/promises';
import * as path from 'path';
import { Customer, DateISO, ID } from 'shared-types';
import { CustomerModel } from './customer.model';
// Enums
export enum DocumentType {
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
  RECEIPT = 'RECEIPT',
  AGREEMENT = 'AGREEMENT',
  REPORT = 'REPORT'
}
// Interface
export interface DocumentTemplate {
  id?: ID;
  customer_id?: ID;
  type: DocumentType;
  language: 'hebrew' | 'english';
  template: string;
  variables: string[];
  isDefault: boolean;
  active: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;
}
// Interface למסמכים שנוצרו
export interface GeneratedDocument {
  id?: ID;
  customer_id?: ID; // מזהה הלקוח, אם יש
  type: DocumentType;
  entityId: ID;
  documentNumber: string;
  templateId: ID;
  htmlContent: string;
  generatedAt: DateISO;
  deliveredAt?: DateISO;
  deliveryMethod?: string;
}

// Class
export class DocumentTemplateModel implements DocumentTemplate {
  id?: ID;
  customer_id?: ID;
  type: DocumentType;
  language: 'hebrew' | 'english';
  template: string;
  variables: string[];
  isDefault: boolean;
  active: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    customer_name: ID,
    type: DocumentType,
    language: 'hebrew' | 'english',
    template: string,
    variables: string[],
    isDefault: boolean = false,
    active: boolean = true,
    createdAt?: DateISO,
    updatedAt?: DateISO
  ) {
    this.id = id;
    this.customer_id = this.customer_id;
    this.type = type;
    this.language = language;
    this.template = template;
    this.variables = variables;
    this.isDefault = isDefault;
    this.active = active;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
  }

  toDatabaseFormat() {
    return {
      customer_id: this.customer_id,
      type: this.type,
      language: this.language,
      template: this.template,
      variables: this.variables,
      isDefault: this.isDefault,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}