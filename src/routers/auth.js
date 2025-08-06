import express from 'express';
import { Router } from "express";
import { validateBody } from '../middlewares/validateBody.js';
import { confirmOAuthSchema, loginUserSchema, registerUserSchema, resetPasswordSchema, sendResetEmailSchema } from '../validation/auth.js';
import { confirmOAuthController, getAuthUrlController, loginUserController, logoutUserController, refreshUserController, registerUserController, requestResetPasswordController, resetPasswordController } from '../controllers/auth.js';

export const authRouter = Router();
const jsonParser = express.json();

authRouter.post('/register', jsonParser, validateBody(registerUserSchema), registerUserController);

authRouter.post('/login', jsonParser, validateBody(loginUserSchema), loginUserController);

authRouter.post('/refresh', refreshUserController);

authRouter.post('/logout', logoutUserController);

authRouter.post('/send-reset-email', jsonParser, validateBody(sendResetEmailSchema), requestResetPasswordController);

authRouter.post('/reset-pwd', jsonParser, validateBody(resetPasswordSchema), resetPasswordController);

authRouter.get('/get-auth-url', getAuthUrlController);

authRouter.post('/confirm-oauth', jsonParser, validateBody(confirmOAuthSchema), confirmOAuthController);