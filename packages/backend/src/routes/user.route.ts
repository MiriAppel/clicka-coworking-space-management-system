import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizeUser}  from "../middleware/authorizeUser-middleware";
import { UserRole } from "shared-types";

const userController = new UserController();
const userRouter = Router();

//לברר איזה הרשאות יש לכל משתמש

userRouter.get("/loginByGoogleId/:googleId", userController.loginByGoogleId.bind(userController));

userRouter.get("/getAllUsers", userController.getAllUsers.bind(userController));

userRouter.get("/getUserById/:id", userController.getUserById.bind(userController));

userRouter.get("/getUserByEmail/:email", userController.getUserByEmail.bind(userController));

userRouter.post("/createUser", userController.createUser.bind(userController));

userRouter.put("/updateGoogleIdUser/:id", userController.updateGoogleIdUser.bind(userController));

userRouter.put("/updateUser/:id", userController.updateUser.bind(userController));

userRouter.delete("/deleteUser/:id", userController.deleteUser.bind(userController));

export default userRouter;