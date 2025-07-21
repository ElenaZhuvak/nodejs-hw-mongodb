import express from 'express';
import { Router } from "express";
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { loginUserController, registerUserController } from '../controllers/auth.js';

export const authRouter = Router();
const jsonParser = express.json();

authRouter.post('/register', jsonParser, validateBody(registerUserSchema), registerUserController);
authRouter.post('/login', jsonParser, validateBody(loginUserSchema), loginUserController);