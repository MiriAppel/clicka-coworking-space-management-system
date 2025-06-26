// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user-service';
import { User } from "shared-types";

export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session;
  const sessionId = req.cookies.sessionId;
  const userService = new UserService();
  if (!token) {
    res.status(401).json({ error: 'not authenticated' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; googleId: string };
    //this part need to work when will be a connection to DB
    const result = await userService.loginByGoogleId(payload.userId);
    if (!result) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    const user: User = result.json();
    (req as any).user = { payload, user, sessionId };
    
    //------------------------------------------------------------
    (req as any).user = { payload, firstName: "לאה", sessionId }; // Store the user object in the request object for further use;
    console.log(sessionId);
    (req as any).sessionId = { sessionId };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'TokenExpired' });
      return;
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};
