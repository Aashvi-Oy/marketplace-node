import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { expressjwt } from 'express-jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import { BasicStrategy } from 'passport-http';

import { readUser } from '../modules/user/services';

import { AppError, UnAuthorizedError } from './errors';

const { JWT_SECRET } = process.env;

// Will put the token payload into req.auth after this (for all protected paths)
export const authenticate = expressjwt({ secret: JWT_SECRET, algorithms: ['HS256'] });

export const hashPassword = (password: string | undefined): string =>
    bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS, 10));

export const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export const createAuthToken = (user: User): Promise<string> => {
    const endOfDayInHours = dayjs().endOf('day').diff(dayjs(), 'hours');
    if (!user) {
        return Promise.reject(new AppError('User object is missing'));
    }
    return Promise.resolve(
        jsonwebtoken.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: `${endOfDayInHours}h`,
        })
    );
};

export const basicAuthentication = new BasicStrategy((username, password, done) => {
    readUser(username)
        .then((user) => {
            if (!comparePassword(password, user.password)) {
                return done(new UnAuthorizedError('Incorrect password.'));
            }
            return done(null, user);
        })
        .catch((err) => done(new UnAuthorizedError(err.message)));
});
