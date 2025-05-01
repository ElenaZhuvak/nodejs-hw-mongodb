import { Router } from "express";
import { getContactByIdController, getContactsController } from "../controllers/contacts.js";

export const contactsRouter = Router();

contactsRouter.get('/contacts', getContactsController);

contactsRouter.get('/contacts/:id', getContactByIdController);