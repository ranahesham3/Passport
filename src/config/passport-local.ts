import passport from 'passport';
import { Strategy as localStrategy, IVerifyOptions } from 'passport-local';
import { compare } from 'bcrypt';
import { User } from '../model/user';
import { Types } from 'mongoose';

const customFields = {
    usernameField: 'email', //the name of the field instead of 'username' which passport unerstand
    passwordField: 'password',
};

const verifyCallback = async (
    email: string,
    password: string,
    done: (
        error: any,
        user?: Express.User | false,
        options?: IVerifyOptions
    ) => void
) => {
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user)
            return done(null, false, { message: 'Wrong username or password' });
        if (!(await compare(password, user.password)))
            return done(null, false, {
                message: 'Wrong username or password',
            });
        else return done(null, user);
    } catch (err) {
        return done(err);
    }
};

const strategy = new localStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser(function (user: Express.User, done) {
    done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        done(null, user ? user : false);
    } catch (err) {
        done(err);
    }
});
