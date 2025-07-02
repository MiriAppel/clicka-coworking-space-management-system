import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";

const expenseRouter = Router();
const controller = new ExpenseController();

expenseRouter.post("/createExpense", controller.createExpense.bind(controller));
expenseRouter.get("/getAllExpenses", controller.getAllExpenses.bind(controller));
expenseRouter.get("/getExpenseById/:id", controller.getExpenseById.bind(controller));
expenseRouter.put("/updateExpense/:id", controller.updateExpense.bind(controller));
expenseRouter.delete("/deleteExpense/:id", controller.deleteExpense.bind(controller));

export default expenseRouter;
