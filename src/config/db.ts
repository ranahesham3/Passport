import { connect } from 'http2';
import mongoose from 'mongoose';

export function connectDB() {
    const DB: string = process.env.MONGOOSE_URL!;

    if (!DB) console.error('Please provide a moongose url');

    mongoose
        .connect(DB)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch((err) => {
            console.log(err);
        });
}
