import { Request, Response, Router } from 'express';
import passport from 'passport';

import { isAuth, isAdmin } from './authMiddleware';
import { User } from '../model/user';

export const router: Router = Router();

//protected routes
router.get('/user-route', isAuth, (req: Request, res: Response) => {
    res.render('protected', { name: req.user!.name });
});
router.get('/admin-route', isAuth, isAdmin, (req: Request, res: Response) => {
    res.render('protected', { name: 'Admin' + req.user!.name });
});

//login
router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});
router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/user-route',
    })
);

//register
router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { password, name, email } = req.body;
        await User.create({
            name,
            email,
            password,
        });
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/register');
    }
});

//logout
router.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) console.log(err);
        else res.redirect('/login');
    });
});
