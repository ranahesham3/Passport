import { IUser } from './model/user';

declare global {
    namespace Express {
        export interface User extends IUser {}
    }
}
