import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // או תוכל להחליף את 'any' עם סוג המידע שאתה מצפה
        }
    }
}

const secretKey = "your_secret_key";

export const authenticateTokenFromCookie = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token; // הנחה שהטוקן נמצא ב-Cookie בשם 'token'

    if (!token) {
        return next(new Error('Unauthorized')); // אם אין טוקן, קוראים ל-next עם שגיאה
    }

    try {
        const decode = jwt.verify(token, secretKey);
        req.user = decode; // שים את המידע של המשתמש ב-req.user
        next(); // המשך למידול הבא
    } catch (error) {
        next(new Error('Invalid Token')); // במקרה של שגיאה באימות, קוראים ל-next עם שגיאה
    }
};
