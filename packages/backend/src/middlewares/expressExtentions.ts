// types/express/index.d.ts
import { User } from '../../../../types/auth'; // או מאיפה שמוגדר טיפוס ה-user שלך

declare module 'express-serve-static-core' {
  interface Request {
    user?: { userId: string; email: string }; // הוספת טיפוס המשתמש לבקשה
  }
}
