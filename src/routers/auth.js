import express from 'express';
import { Router } from "express";
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema, resetPasswordSchema, sendResetEmailSchema } from '../validation/auth.js';
import { loginUserController, logoutUserController, refreshUserController, registerUserController, requestResetPasswordController, resetPasswordController } from '../controllers/auth.js';

export const authRouter = Router();
const jsonParser = express.json();

authRouter.post('/register', jsonParser, validateBody(registerUserSchema), registerUserController);

authRouter.post('/login', jsonParser, validateBody(loginUserSchema), loginUserController);

authRouter.post('/refresh', refreshUserController);

authRouter.post('/logout', logoutUserController);

authRouter.post('/send-reset-email', jsonParser, validateBody(sendResetEmailSchema), requestResetPasswordController);

authRouter.post('/reset-pwd', jsonParser, validateBody(resetPasswordSchema), resetPasswordController);