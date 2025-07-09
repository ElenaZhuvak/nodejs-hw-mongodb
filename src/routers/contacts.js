import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getContactByIdController, getContactsController, replaceContactController, updateContactController,  } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

export const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', jsonParser, ctrlWrapper(createContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

contactsRouter.put('/:contactId', jsonParser, ctrlWrapper(replaceContactController));

contactsRouter.patch('/:contactId', jsonParser, ctrlWrapper(updateContactController));