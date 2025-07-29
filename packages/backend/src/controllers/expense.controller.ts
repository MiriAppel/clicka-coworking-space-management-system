import { Request, Response } from "express";
import { ExpenseService } from "../services/expense.services";
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  GetExpensesRequest,
  MarkExpenseAsPaidRequest
} from "shared-types";

export class ExpenseController {
  expenseService = new ExpenseService();

  async getAllExpenses1(req: Request, res: Response) {
    const result = await this.expenseService.getExpenses1();
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  }

  async createExpense(req: Request, res: Response) {
    const expenseData: CreateExpenseRequest = req.body;
    console.log('Prepared expense data:', JSON.stringify(expenseData, null, 2));
    const result = await this.expenseService.createExpense(expenseData);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to create expense" });
    }
  }

  async getAllExpenses(req: Request, res: Response) {
    const filters: GetExpensesRequest = req.query as unknown as GetExpensesRequest;
    const result = await this.expenseService.getExpenses(filters);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  }

  async getExpenseById(req: Request, res: Response) {
    const expenseId = req.params.id;
    const result = await this.expenseService.getExpenseById(expenseId);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  }

  async updateExpense(req: Request, res: Response) {
    const expenseId = req.params.id;
    const updateData: UpdateExpenseRequest = req.body;
    console.log('Prepared update data:', JSON.stringify(updateData, null, 2));
    const result = await this.expenseService.updateExpense(expenseId, updateData);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to update expense" });
    }
  }

  async markExpenseAsPaid(req: Request, res: Response) {
    const expenseId = req.params.id;
    const paidData: MarkExpenseAsPaidRequest = req.body;
    const result = await this.expenseService.markExpenseAsPaid(expenseId, paidData);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to mark expense as paid" });
    }
  }

  async deleteExpense(req: Request, res: Response) {
    const expenseId = req.params.id;
    const result = await this.expenseService.deleteExpense(expenseId);
    if (result) {
      res.status(200).send();
    } else {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  }

  async getExpensesByPage(req: Request, res: Response) {
    console.log("getExpensesByPage called");
    const filters = req.params;
    console.log("Filters received:", filters);
    const pageNum = Math.max(1, Number(filters.page) || 1);
    const limitNum = Math.max(1, Number(filters.limit) || 50);
    const filtersForService = {
      page: pageNum,
      limit: limitNum,
    };

    console.log("Filters passed to service:", filtersForService);

    try {
      const expenses = await this.expenseService.getExpensesByPage(filtersForService);
      if (expenses.length > 0) {
        res.status(200).json(expenses);
      } else {
        res.status(404).json({ message: "No expenses found" });
      }
    } catch (error: any) {
      console.error("❌ Error in getExpensesByPage controller:");
      if (error instanceof Error) {
        console.error("🔴 Message:", error.message);
        console.error("🟠 Stack:", error.stack);
      } else {
        console.error("🟡 Raw error object:", error);
      }

      res
        .status(500)
        .json({ message: "Server error", error: error?.message || error });
    }

    console.log("getExpensesByPage completed");
  }

  async getExpensesByFilter(req: Request, res: Response) {
    const filters = req.query.id ? { id: req.query.id } : req.query;
    try {
      const expenses = await this.expenseService.getExpenseById(filters.toString());

      if (expenses.length > 0) {
        res.status(200).json(expenses);
      } else {
        res.status(404).json({ message: "No expenses found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error filtering expenses", error });
    }
  }

  async getPettyCashExpenses(req: Request, res: Response) {
    try {
      const expenses = await this.expenseService.getPettyCashExpenses();
      if (!expenses || expenses.length === 0) {
        return res.status(200).json([]);
      }
      return res.status(200).json(expenses);
    } catch (error) {
      console.error('Error in getPettyCashExpenses controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
