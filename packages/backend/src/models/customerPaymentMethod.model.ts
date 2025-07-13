import type { CustomerPaymentMethod, CustomerPeriod, DateISO, ExitReason, ID } from "shared-types";
import { UUID } from "node:crypto";

export class customerPaymentMethodModel implements CustomerPaymentMethod {

  id?: UUID;
  customerId: ID;
  creditCardLast4?: string;
  creditCardExpiry?: string;
  creditCardHolderIdNumber?: string;
  creditCardHolderPhone?: string;
  isActive: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: UUID,
    customerId: ID,
    isActive: boolean,
    createdAt: DateISO,
    updatedAt: DateISO,
    creditCardLast4?: string,
    creditCardExpiry?: string,
    creditCardHolderIdNumber?: string,
    creditCardHolderPhone?: string,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
    this.creditCardExpiry = creditCardExpiry;
    this.creditCardHolderIdNumber = creditCardHolderIdNumber;
    this.creditCardHolderPhone = creditCardHolderPhone;
    this.creditCardLast4 = creditCardLast4;
  }

  toDatabaseFormat() {
    return {
      customer_id: this.customerId,
      credit_card_last_4: this.creditCardLast4,
      credit_card_expiry: this.creditCardExpiry,
      credit_card_holder_id_number: this.creditCardHolderIdNumber,
      credit_card_holder_phone: this.creditCardHolderPhone,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  static fromDatabaseFormat(dbData: any): customerPaymentMethodModel {
    return new customerPaymentMethodModel(
      dbData.id,
      dbData.customer_id,
      dbData.is_active,
      dbData.created_at,
      dbData.updated_at,
      dbData.credit_card_last_4,
      dbData.credit_card_expiry,
      dbData.credit_card_holder_id_number,
      dbData.credit_card_holder_phone
    );
  }

  static fromDatabaseFormatArray(dbDataArray: any[]): customerPaymentMethodModel[] {
    return dbDataArray.map(dbData => customerPaymentMethodModel.fromDatabaseFormat(dbData));
  }
}
