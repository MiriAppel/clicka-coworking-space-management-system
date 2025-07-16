import { Request, Response, NextFunction } from 'express';
import { UserRole } from "shared-types";
import { verifyJwtToken } from '../services/authService';

// Auth middleware to check user permissions
export const authorizeUser = (permission: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // שליפת הטוקן מהקוקי
            const sessionToken = req.cookies.session;

            if (!sessionToken) {
                console.log('No auth token provided');
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            //אימות הטוקן
            const payload = verifyJwtToken(sessionToken);
            console.log('Decoded token:', payload);

            // שליפת ה role מהטוקן
            const userRole = payload.role as UserRole;

            // בדיקה אם יש role בטוקן
            if (!userRole) {
                res.status(401).json({ error: 'Invalid token - missing role' });
                return;
            }

            if (userRole && permission.includes(userRole)) {
                console.log(permission);

                next(); // אם יש הרשאה, המשך למסלול הבא
            } else {
                res.status(403).send('Forbidden'); // אם אין הרשאה, החזר שגיאת גישה
            }

        } catch (error) {
            console.error('Token verification failed:', error);
        }
    };
};
