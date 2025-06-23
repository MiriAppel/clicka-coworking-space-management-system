
import { DateISO, FileReference } from "../types/core";
import { CustomerPeriod, CustomerStatus, PaymentMethod, WorkspaceType } from "../types/customer";
import { Person } from "./Person";

export class Customer extends Person {
  idNumber!: string;
  businessName!: string;
  status!: CustomerStatus[];
  currentWorkspaceType!: WorkspaceType[];
  workspaceCount!: number;
  contractSignDate?: DateISO;
  contractStartDate?: DateISO;
  billingStartDate?: DateISO;
  invoiceName?: string;
  contractDocuments?: FileReference[];
  paymentMethods!: PaymentMethod[];
  periods!: CustomerPeriod[];

  constructor(data: Partial<Customer>) {
    super(data)
    Object.assign(this, data);
  }
}
