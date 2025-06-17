import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { authenticateTokenFromCookie ,authorizeUser}  from "../middleware/auth-middleware";

const userController = new UserController();
const userRouter = Router();

//לברר איזה הרשאות יש לכל משתמש

userRouter.get("/loginByGoogleId/:googleId", authenticateTokenFromCookie, userController.loginByGoogleId.bind(userController));

userRouter.post("/createUser",authenticateTokenFromCookie,authorizeUser('ADMIN'), userController.createUser.bind(userController));

userRouter.get("/getAllUsers",authenticateTokenFromCookie, userController.getAllUsers.bind(userController));

userRouter.get("/getUserById/:id",authenticateTokenFromCookie, userController.getUserById.bind(userController));

userRouter.put("/updateUser/:id",authenticateTokenFromCookie, userController.updateUser.bind(userController));

userRouter.delete("/deleteUser/:id",authenticateTokenFromCookie, userController.deleteUser.bind(userController));

export default userRouter;
