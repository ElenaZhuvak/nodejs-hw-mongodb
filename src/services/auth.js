import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/constants.js';
import crypto from 'crypto';
import { Session } from '../db/models/session.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

const { randomBytes } = crypto;

// ****** Register
export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: encryptedPassword });
}

// ****** Login
export async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new createHttpError(401, 'Email or password is not correct');
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new createHttpError(401, 'Email or password is not correct');
  }

  await Session.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
}

// ****** Refresh
function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
}

export async function refreshUser({ sessionId, refreshToken }) {
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Not found session');
  }

  const sessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (sessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
}

// ****** Logout
export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

// ****** Request Reset Password Email
export async function requestResetPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5min',
    }
  );

  const sendMail = await sendMail({
    // from: SMTP_FROM,
    to: email,
    subject: 'Reset password',
    html: `<p>To reset the password, please visit this <a href="http://localhost:3000/reset-password?token=${token}">link</a></p>`,
  });
  if (!sendMail) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
}
