import passport from 'passport';
import {
    Strategy as jwtStrategy,
    ExtractJwt,
    VerifyCallback,
    VerifiedCallback,
    StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { User } from '../model/user';

const options: StrategyOptionsWithoutRequest = {
    secretOrKey: process.env.JWT_SECRET!,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256'],
};

const verify: VerifyCallback = async (payload: any, done: VerifiedCallback) => {
    try {
        const user = await User.findOne({ _id: payload.userId });
        if (!user)
            return done(null, false, { message: 'You are not authorized' });
        else return done(null, user);
    } catch (err) {
        return done(err);
    }
};

const strategy = new jwtStrategy(options, verify);

passport.use(strategy);
