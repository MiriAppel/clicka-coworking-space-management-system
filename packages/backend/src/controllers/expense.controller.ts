// controllers/expense-controller.ts
import { Request, Response } from 'express';
import { ExpenseModel } from '../models/expense.model';
import { ExpenseService } from '../services/expense.services';

export class ExpenseController {
  private service = new ExpenseService();

  async createExpense(req: Request, res: Response) {
    const expense = new ExpenseModel(req.body);
    const result = await this.service.createExpense(expense);
    if (result) res.status(200).json(result);
    else res.status(500).json({ error: "Failed to create expense" });
  }

 async getAllExpenses(req: Request, res: Response) {
  }
  async getExpenseById(req: Request, res: Response) {
    const result = await this.service.getExpenseById(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(404).json({ error: "Expense not found" });
  }

  async updateExpense(req: Request, res: Response) {
    const expense = new ExpenseModel(req.body);
    const result = await this.service.updateExpense(req.params.id, expense);
    if (result) res.status(200).json(result);
    else res.status(500).json({ error: "Failed to update expense" });
  }

  async deleteExpense(req: Request, res: Response) {
    const result = await this.service.deleteExpense(req.params.id);
    if (result) res.status(200).send();
    else res.status(500).json({ error: "Failed to delete expense" });
  }
}
