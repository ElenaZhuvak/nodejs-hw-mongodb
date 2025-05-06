import { Router } from "express";
import { createContactController, getContactByIdController, getContactsController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

export const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:id', ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));