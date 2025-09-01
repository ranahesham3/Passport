import passport from 'passport';
import {
    Strategy as googleStrategy,
    StrategyOptionsWithRequest,
    VerifyFunctionWithRequest,
    VerifyFunctionWithRequestAndParams,
    VerifyCallback,
} from 'passport-google-oauth2';
import { User } from '../model/user';

const options: StrategyOptionsWithRequest = {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/google/callback',
    passReqToCallback: true,
};

const verify: VerifyFunctionWithRequest = async (
    request,
    accessToken,
    refreshToken,
    profile,
    done
) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user)
            user = await User.create({
                googleId: profile.id,
                name: profile.given_name,
                email: profile.email,
            });
        if (user) done(null, user);
        else done(null, false);
    } catch (err) {
        done(err);
    }
};

const strategy = new googleStrategy(options, verify);

passport.use(strategy);

passport.serializeUser(
    (user: Express.User, done: (err: any, id?: unknown) => void) => {
        done(null, user._id);
    }
);

passport.deserializeUser(
    async (
        id: unknown,
        done: (err: any, user?: Express.User | false | null) => void
    ) => {
        try {
            const user = await User.findById(id);
            done(null, user ? user : false);
        } catch (err) {
            done(err);
        }
    }
);
