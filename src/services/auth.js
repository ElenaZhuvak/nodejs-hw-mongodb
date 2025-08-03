import { User } from '../db/models/user.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/constants.js';
import { Session } from '../db/models/session.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import * as fs from 'node:fs';
import path from 'node:path';

const { randomBytes } = crypto;
const frontend_domain = getEnvVar('APP_DOMAIN');
const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/request-reset-pwd-email.hbs'),
  { encoding: 'utf-8' },
);


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
    },
  );
  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);

  const sendMailReset = await sendMail({
    // from: SMTP_FROM,
    to: email,
    subject: 'Reset password',
    html: template({resetPasswordLink: `${frontend_domain}/reset-password?token=${token}`}),
  });
  
  if (!sendMailReset) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
}

// ****** Reset Password
export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    const user = await User.findById(decoded.sub);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired or invalid');
    }

    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is Unauthorized');
    }

    throw error;
  }
}
