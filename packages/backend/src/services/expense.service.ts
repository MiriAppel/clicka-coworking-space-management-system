// expense-service.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ExpenseModel } from '../models/expense.model';

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
    return data as ExpenseModel;
  }

  async getAllExpenses(): Promise<ExpenseModel[] | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');
    if (error) return null;
    return data as ExpenseModel[];
  }

  async getExpenseById(id: string): Promise<ExpenseModel | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as ExpenseModel;
  }

  async updateExpense(id: string, expense: ExpenseModel): Promise<ExpenseModel | null> {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense.toDatabaseFormat())
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as ExpenseModel;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    return !error;
  }
}
