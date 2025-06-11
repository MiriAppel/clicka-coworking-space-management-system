import { DateISO, FileReference, ID } from "../types/core";
import { Customer, CustomerPeriod, CustomerStatus, PaymentMethod, WorkspaceType } from "../types/customer";
import { PaymentMethodModel } from "./paymentMethodModel.model";


class CustomerModel implements Customer {
      id: ID;
      name: string;
      phone: string;
      email: string;
      idNumber: string;
      businessName!: string;
      businessType!: string;
      status: CustomerStatus;
      currentWorkspaceType?: WorkspaceType;
      workspaceCount: number;
      contractSignDate?: DateISO;
      contractStartDate?: DateISO;
      billingStartDate?: DateISO;
      notes?: string;
      invoiceName?: string;
      contractDocuments?: FileReference[];
      paymentMethods: PaymentMethodModel[];
      periods: CustomerPeriod[];
      createdAt: DateISO;
      updatedAt: DateISO;

    constructor(id: string, name: string, email: string, phone: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.createdAt = createdAt;
    }
}

export { CustomerModel };