import { Schema, model, Document, Types } from 'mongoose';
import { hash } from 'bcrypt';

//interface representing the user document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    admin: Boolean;
    googleId: string;
}

//create a schema corresponding to the document interface
const userSchema = new Schema<IUser>({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
    },
});

userSchema.pre('save', async function (next) {
    this.password = await hash(this.password, 12);
});

export const User = model<IUser>('User', userSchema);
