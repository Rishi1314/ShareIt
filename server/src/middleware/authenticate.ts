import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: any, res: any, next: NextFunction) {
  console.time('⏱️ JWT Verification Time');
  console.log('🔐 JWT middleware triggered for:', req.method, req.originalUrl);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.timeEnd('⏱️ JWT Verification Time');
    return res.status(401).json({ error: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  } finally {
    console.timeEnd('⏱️ JWT Verification Time');
  }
}
