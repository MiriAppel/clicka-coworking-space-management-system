import { Request, Response, NextFunction } from 'express';
import { UserRole } from 'shared-types';
export const authorizeUser = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // const user = req.user as { role: UserRole } | undefined;
    // if (!user) {
    //   return res.status(401).json({ error: 'User not authenticated' });
    // }
    // if (!allowedRoles.includes(user.role)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }
    return next(); // כל עוד אין בעיה – ממשיכים הלאה
  };
};






