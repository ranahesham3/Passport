import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();

    res.status(401).json({ massage: `You're not authorized to this resource` });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.admin) return next();

    res.status(401).json({ massage: `You're not authorized to this resource` });
};
