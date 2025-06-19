import { UserService } from "../services/user-service";
import { Request, Response } from "express";

export class UserController {
    userService = new UserService();
    async createUser(req: Request, res: Response) {
        const result = await this.userService.createUser(req.body);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to create user" });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        const result = await this.userService.getAllUsers();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    }

    async getUserById(req: Request, res: Response) {
        const userId = req.params.id;
        const result = await this.userService.getUserById(userId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }

    async loginByGoogleId(req: Request, res: Response) {
        const googleId = req.params.googleId;
        const result = await this.userService.loginByGoogleId(googleId);
        
        if (result) {
            // שליפת ה-role מתוך ה-result
            const role = result.role;
    
            // הגדרת cookie עם ה-role
            const expirationDays = 7; // מספר הימים שהעוגיה תהיה זמינה
            const date = new Date();
            date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
            
            // שמירת ה-cookie עם ה-role
            res.cookie('role', role, { 
                expires: date, 
                httpOnly: true // httpOnly כדי למנוע גישה דרך JavaScript
            });
    
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }
    

    async updateUser(req: Request, res: Response) {
        const userId = req.params.id;
        const updatedData = req.body;
        const result = await this.userService.updateUser(userId, updatedData);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to update user" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;
        const result = await this.userService.deleteUser(userId);
        if (result) {
            res.status(204).send(); 
        } else {
            res.status(500).json({ error: "Failed to delete user" });
        }
    }

}