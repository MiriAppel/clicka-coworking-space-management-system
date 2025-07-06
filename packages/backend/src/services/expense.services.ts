// services/expense-service.ts
import { createClient } from '@supabase/supabase-js';
import { ExpenseModel } from '../models/expense.model';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export class ExpenseService {
  async createExpense(expense: ExpenseModel): Promise<ExpenseModel | null> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense.toDatabaseFormat()])
      .select()
      .single();

    if (error) return null;
    return ExpenseModel.fromDatabaseFormat(data);
  }

  async getAllExpenses(): Promise<ExpenseModel[] | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');

    if (error) return null;
    return data.map(ExpenseModel.fromDatabaseFormat);
  }

  async getExpenseById(id: string): Promise<ExpenseModel | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return ExpenseModel.fromDatabaseFormat(data);
  }

  async updateExpense(id: string, expense: ExpenseModel): Promise<ExpenseModel | null> {
    const { data, error } = await supabase
      .from('expenses')
      .update([expense.toDatabaseFormat()])
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    return ExpenseModel.fromDatabaseFormat(data);
  }

  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    return !error;
  }
}
