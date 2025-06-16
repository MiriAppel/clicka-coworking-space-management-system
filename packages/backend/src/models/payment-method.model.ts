import { PaymentMethod } from "../types/customer";

export class PaymentMethodModel implements PaymentMethod {
  id: string;
  customerId: string;
  creditCardLast4?: string;
  creditCardExpiry?: string;
  creditCardHolderIdNumber?: string;
  creditCardHolderPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(data: {
    id: string;
    customerId: string;
    creditCardLast4?: string;
    creditCardExpiry?: string;
    creditCardHolderIdNumber?: string;
    creditCardHolderPhone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.creditCardLast4 = data.creditCardLast4;
    this.creditCardExpiry = data.creditCardExpiry;
    this.creditCardHolderIdNumber = data.creditCardHolderIdNumber;
    this.creditCardHolderPhone = data.creditCardHolderPhone;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      customerId: this.customerId,
      creditCardLast4: this.creditCardLast4,
      creditCardExpiry: this.creditCardExpiry,
      creditCardHolderIdNumber: this.creditCardHolderIdNumber,
      creditCardHolderPhone: this.creditCardHolderPhone,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

}
