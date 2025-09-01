import { Request, Response, Router } from 'express';
import passport from 'passport';
import { compare } from 'bcrypt';

import { isAuth, isAdmin } from './authMiddleware';
import { User } from '../model/user';
import { issueJwt } from '../utils/jwt';

export const router: Router = Router();

//protected routes
router.get(
    '/user-route',
    passport.authenticate('jwt', { session: false }),
    (req: Request, res: Response) => {
        res.render('protected', { name: req.user!.name });
    }
);
router.get(
    '/admin-route',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    (req: Request, res: Response) => {
        res.render('protected', { name: 'Admin' + req.user!.name });
    }
);

//login
router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { password, name, email } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (user && (await compare(password, user.password))) {
            const jwt = issueJwt(user._id!.toString());
            return res.status(200).json({ success: true, user: user, ...jwt });
        }
        res.status(401).json({
            success: false,
            message: 'Wrong username or password',
        });
    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }
});

//register
router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { password, name, email } = req.body;
        const user = await User.create({
            name,
            email,
            password,
        });

        const jwt = issueJwt(user._id!.toString());
        res.status(201).json({ success: true, user: user, ...jwt });
    } catch (err) {
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
