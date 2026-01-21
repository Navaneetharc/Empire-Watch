import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string, role: string = 'user') => {
    const token = jwt.sign({ userId,role }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });

    return token;
};

export default generateToken;