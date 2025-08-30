import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
var MongoDBStore = require('connect-mongodb-session')(session);

import { connectDB } from './config/db';
import { router } from './routes/index';
import './types';
import './config/passport-local';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

//MongoDBStore to store the sessions when using local strategy
var store = new MongoDBStore({
    uri: process.env.MONGOOSE_URL,
    collection: 'mySessions',
});
store.on('error', function (error: Error) {
    console.log(error);
});
//express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
        },
        store: store,
    })
);

//-------------------------------------Passport---------------
app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

//------------------------------------------------------------
app.use(router);

app.listen(3000, () => {
    console.log('working on server with port 3000');
});
