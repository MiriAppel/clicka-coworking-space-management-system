import { Request, Response, NextFunction } from 'express';

import { UserRole } from "shared-types";


// Auth middleware to check user permissions
export const authorizeUser = (permission: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        console.log('sdfghjjj');
        
        const userPermissions = UserRole.ADMIN // הנחה שההרשאה נמצאות ב-Cookie בשם 'role'
        if (userPermissions && permission.includes(userPermissions)){
            console.log(permission);

            next(); // אם יש הרשאה, המשך למסלול הבא
        } else {
            res.status(403).send('Forbidden'); // אם אין הרשאה, החזר שגיאת גישה
        }
    };
};