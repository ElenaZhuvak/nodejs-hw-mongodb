import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getContactByIdController, getContactsController, replaceContactController, updateContactController,  } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

export const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', jsonParser, ctrlWrapper(createContactController));

contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

contactsRouter.put('/contacts/:contactId', jsonParser, ctrlWrapper(replaceContactController));

contactsRouter.patch('/contacts/:contactId', jsonParser, ctrlWrapper(updateContactController));