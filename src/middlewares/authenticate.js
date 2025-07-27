import createHttpError from "http-errors";
import { Session, User } from "../db/models/user.js";

export async function authenticate(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw createHttpError(401, 'Please provide Authorization Header');
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if(bearer !== 'Bearer' || !token) {
        throw createHttpError(401, 'Auth header should be of type Bearer');
    }

    const session = await Session.findOne({ accessToken: token});
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }
    const isAccessTokenExpired = new Date > new Date(session.accessTokenValidUntil);
    if(!isAccessTokenExpired) {
        throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);
    if(!user) {
        throw createHttpError(401, 'User not found');
    }

    req.user = {id: user._id, name: user.name };

    next();
} 