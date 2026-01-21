import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      if(decoded.role === 'admin'){
        req.user = {role: 'admin', id: 'admin-001'};
        next();
      }else{

        const user = await User.findById(decoded.id || decoded.userId).select('-password');

        if(!user){
          return res.status(401).json({message: 'User not found'});
        }

        if(user.isBlocked){
          return res.status(403).json({
            message: 'Account Blocked: You have been banned by the admin.'
          });
        }

        req.user = user;
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};