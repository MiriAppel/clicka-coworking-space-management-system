import { create } from "zustand";
import { Expense, ExpenseCategory } from "../../../../types/expense";
import { ExpenseFilter } from "../../../../types/expenseFilter";
import { ValidationResult } from "../../../../types/validationResult";
import { ID, FileReference } from "../../../../types/core";

interface ExpenseState {
  expenses: Expense[];
  selectedExpense?: Expense;
  expenseDocuments: FileReference[];
  loading: boolean;
  error?: string;

  // CRUD
  fetchExpenses: () => Promise<void>;
  fetchExpenseDetails: (expenseId: ID) => Promise<void>;
  createExpense: (expenseData: Expense) => Promise<Expense>;
  updateExpense: (expenseId: ID, updatedExpenseData: Expense) => Promise<Expense>;
  deleteExpense: (expenseId: ID) => Promise<void>;

  // List & Filter
 // handleSearch: (query: string) => void;
 // handleFilter: (filter: ExpenseFilter) => void;
  //filterExpenses: (filter: ExpenseFilter) => Promise<Expense[]>;
  //refreshExpenseList: () => Promise<void>;
  //handleSelectExpense: (expenseId: ID) => void;

  // Details
  updateExpenseStatus: (expenseId: ID, status: string) => Promise<Expense>;
  fetchExpenseDocuments: (expenseId: ID) => Promise<void>;

  // Form
  handleFieldChange: (field: keyof Expense, value: any) => void;
  validateExpenseForm: (data: Expense) => ValidationResult;
  handleCreateExpense: (data: Expense) => Promise<Expense>;
  handleUpdateExpense: (expenseId: ID, data: Expense) => Promise<Expense>;
  resetForm: () => void;
 // handleCloseForm: () => void;

  // Filter UI
 // applyExpenseFilter: (filter: ExpenseFilter) => void;
};

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  selectedExpense: undefined,
  expenseDocuments: [],
  loading: false,
  error: undefined,

  // CRUD
  fetchExpenses: async () => {},
  fetchExpenseDetails: async () => {},
  createExpense: async () => { return {} as Expense; },
  updateExpense: async () => { return {} as Expense; },
  deleteExpense: async () => {},

  // List & Filter
  //handleSearch: () => {},
  //handleFilter: () => {},
  //filterExpenses: async () => { return []; },
  //refreshExpenseList: async () => {},
 // handleSelectExpense: () => {},

  // Details
  updateExpenseStatus: async () => { return {} as Expense; },
  fetchExpenseDocuments: async () => {},

  // Form
  handleFieldChange: () => {},
  validateExpenseForm: () => ({ isValid: true, errors: [] }),
  handleCreateExpense: async () => { return {} as Expense; },
  handleUpdateExpense: async () => { return {} as Expense; },
  resetForm: () => {},
  //handleCloseForm: () => {},

  // Filter UI
 // applyExpenseFilter: () => {},
}));