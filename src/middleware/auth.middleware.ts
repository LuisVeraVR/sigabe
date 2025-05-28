import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user';
import { IUser } from '../entity/user';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      const payload = decoded as { userId: string };
      
      try {
        if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
          res.status(401).json({ message: 'Invalid user ID in token' });
          return;
        }

        const user = await User.findById(payload.userId);
        
        if (!user) {
          res.status(401).json({ message: 'User not found' });
          return;
        }
        
        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({ message: 'Database error' });
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication error' });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: 'Access denied: Admin role required' });
    return;
  }
  next();
};