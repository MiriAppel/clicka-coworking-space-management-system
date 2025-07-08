import { Request, Response, NextFunction } from 'express';
import { AuditLogService } from '../services/auditLog.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const globalAuditMiddleware = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  // רק עבור פעולות שמשנות נתונים
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    
    const originalSend = res.send;
    
    res.send = function(data) {
      // בדיקה שהבקשה הצליחה
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setImmediate(() => {
          logAuditAsync(req, res);
        });
      }
      
      return originalSend.call(this, data);
    };
  }
  
  next();
};

async function logAuditAsync(req: AuthenticatedRequest, res: Response) {
  try {
    const auditService = new AuditLogService();
    
    // זיהוי הפונקציה מה-URL
    const functionName = extractFunctionFromUrl(req.path, req.method);
    
    // מציאת target user email אם זה קשור למשתמשים
    let targetInfo = "";
    // if (req.path.includes('/users/') && req.method !== 'POST') {
    //   // אם יש email בbody (למקרה של עדכון)
    //   if (req.body && req.body.id) {
    //     targetInfo = req.body.id;
    //   }
    //   // או אם יש ID ואת רוצה לשלוף את האמייל מהDB
    //   // targetUserEmail = await getUserEmailById(req.params.id);
    // }

    // שימוש בפונקציה המעודכנת של AuditLogService
    await auditService.createAuditLog(req, {
      timestamp: new Date().toISOString(),
      action: req.method as 'POST' | 'PUT' | 'DELETE',
      functionName,
      targetInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

function extractFunctionFromUrl(path: string, method: string): string {
  // דוגמאות:
  // POST /api/users -> createUser
  // PUT /api/users/123 -> updateUser
  // DELETE /api/users/123 -> deleteUser
  // POST /api/vendors -> createVendor
  
  const parts = path.split('/').filter(p => p && p !== 'api');
  const resource = parts[0] || 'unknown';
  
  switch (method) {
    case 'POST':
      return `create${capitalize(resource)}`;
    case 'PUT':
      return `update${capitalize(resource)}`;
    case 'DELETE':
      return `delete${capitalize(resource)}`;
    default:
      return 'unknown';
  }
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/s$/, ''); // מסיר s בסוף
}