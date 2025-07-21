import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// export interface AuthenticatedRequest extends Request {
//   user?: { id: string };
// }

export function authenticateJWT(req:any,res:any, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
