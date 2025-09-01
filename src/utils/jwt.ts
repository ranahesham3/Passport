import jwt from 'jsonwebtoken';

export const issueJwt = (userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });
    return {
        token: `Bearer ${token}`,
        expiresIn: '1d',
    };
};
