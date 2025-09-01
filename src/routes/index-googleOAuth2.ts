import { Request, Response, Router } from 'express';
import passport from 'passport';

import { isAuth } from './authMiddleware';
import { User } from '../model/user';

export const router: Router = Router();

//home
router.get('/', (req: Request, res: Response) => {
    res.send(`<a href='/auth/google>Authenticate with Google</a>`);
});

//to get authenticated
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

//google callback (You 're authentecated)
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        successRedirect: '/protected',
    })
);

// (You 're not authentecated)
router.get('/auth/failure', (req: Request, res: Response) => {
    res.status(401).json({
        success: false,
        message: 'Something went wrong',
    });
});

//protected routes
router.get('/protected', isAuth, (req: Request, res: Response) => {
    res.render('protected', { name: req.user!.name });
});

//logout
router.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) console.log(err);
        else res.redirect('/');
    });
});
