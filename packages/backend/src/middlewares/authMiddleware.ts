// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifySession = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session;

  if (!token) {
    res.status(401).json({ error: 'לא מחובר. אנא התחבר שוב.' });
    return;

  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
    // שימי את המידע על המשתמש ב-request כדי שיהיה זמין ב-route
    req.user = payload;
    next(); // ממשיכים ל-route הבא
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
     res.status(401).json({ error: 'הסשן פג תוקף. אנא התחבר שוב.' });
      return;
    }
    res.status(403).json({ error: 'טוקן לא תקין' });
  }
};
