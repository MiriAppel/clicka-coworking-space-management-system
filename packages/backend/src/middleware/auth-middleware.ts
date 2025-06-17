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
    const token = req.cookies.jwtToken; // הנחה שהטוקן נמצא ב-Cookie בשם 'jwtToken'

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

// Auth middleware to check user permissions
export const authorizeUser = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userPermissions = req.cookies.role; // הנחה שההרשאות נמצאות ב-req.user

        if (userPermissions && userPermissions.includes(permission)) {
            next(); // אם יש הרשאה, המשך למסלול הבא
        } else {
            res.status(403).send('Forbidden'); // אם אין הרשאה, החזר שגיאת גישה
        }
    };
};


