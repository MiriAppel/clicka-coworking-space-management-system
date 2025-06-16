import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { authenticateTokenFromCookie } from "../middleware/auth-middleware";

const userController = new UserController();
const userRouter = Router();

//לברר איזה הרשאות יש לכל משתמש

userRouter.post("/users",authenticateTokenFromCookie, userController.createUser.bind(userController));

userRouter.get("/users",authenticateTokenFromCookie, userController.getAllUsers.bind(userController));

userRouter.get("/users/:id",authenticateTokenFromCookie, userController.getUserById.bind(userController));

userRouter.put("/users/:id",authenticateTokenFromCookie, userController.updateUser.bind(userController));

userRouter.delete("/users/:id",authenticateTokenFromCookie, userController.deleteUser.bind(userController));

export default userRouter;
