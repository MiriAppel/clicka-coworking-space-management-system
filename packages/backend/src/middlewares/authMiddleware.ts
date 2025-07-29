
// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { User } from "shared-types";
import { UserTokenService } from '../services/userTokenService';
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
    const result = await userService.loginByGoogleId(payload.googleId);
    if (!result) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    const userTokenService = new UserTokenService();
    if (await userTokenService.checkIfExpiredAccessToken(payload.userId))
      throw new Error('TokenExpiredError');
    const user: User = result;
    (req as any).user = { payload, user, sessionId };// Store the user object in the request object for further use;
    //------------------------------------------------------------
    // (req as any).user = { payload, firstName: "aaaa", sessionId };
    console.log(sessionId);
    (req as any).sessionId = { sessionId };

    next();
  } catch (err: any) {
    if (err.message == 'TokenExpiredError') {
      res.status(401).json({ error: 'TokenExpired' });
      return;
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};