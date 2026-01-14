import type { Request, Response, NextFunction } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}

const jwtSecretKey = "heyheyhey";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    
    if (!header) {
        res.status(401).json({ message: "Authorization header missing" });
        return;
    }

    try {
        const decoded = jwt.verify(header, jwtSecretKey) as { userId: string };
        req.userId = decoded.userId;
        next(); // This was missing!
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
}