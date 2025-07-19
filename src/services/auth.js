import { User } from "../db/models/user.js";

export async function registerUser(payload) {
    return await User.create(payload);
};