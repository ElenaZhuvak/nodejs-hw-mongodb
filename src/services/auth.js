import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: encryptedPassword});
};

export async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new createHttpError(401, 'Email or password is not correct');
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new createHttpError(401, 'Email or password is not correct');
  }
}