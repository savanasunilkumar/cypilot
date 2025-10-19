import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '@cypilot/shared';

export interface AuthenticatedRequest extends Request {
  user?: User;
  accessToken?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Access token is required'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = decoded.user;
    req.accessToken = decoded.accessToken;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      },
      timestamp: new Date().toISOString()
    });
  }
};

export const generateToken = (user: User, accessToken: string): string => {
  return jwt.sign(
    { user, accessToken },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret);
};
