// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user-service';
import { User } from '../../../../types/auth';

export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session;
  const userService = new UserService();
  if (!token) {
    res.status(401).json({ error: 'not authenticated' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; googleId: string };
    /*
        const result = await userService.loginByGoogleId(payload.userId);
        if (!result) {
          res.status(404).json({ error: 'user not found' });
          return;
        }
        const user: User = result.json();*/

    (req as any).user = { payload, firstName: "לאה" }; // Store the user object in the request object for further use
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'TokenExpired' });
      return;
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};
