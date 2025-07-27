import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { contactsRouter } from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.js';

const PORT = Number(getEnvVar('PORT', 3000));

export const setupServer = () => {  
    const app = express();

    app.use(cookieParser());
    app.use(cors());
    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
        level: 'error'
        // удобно, чтобы не засорять каждый раз терминал логами, логирует только ошибки
    }));

    app.use('/auth', authRouter);
    app.use('/contacts', authenticate, contactsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, (error) => {
        if (error) {
            throw error;
        }
        console.log(`Server is running on port ${PORT}`);
    });
};