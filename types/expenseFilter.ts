
import { ExpenseCategory } from "./expense";
import { ID } from "./core";

export interface ExpenseFilter {
  category?: ExpenseCategory;
  vendorId?: ID;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}


