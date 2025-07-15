import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, replaceContactController, updateContactController,  } from "../controllers/contacts.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateId } from "../middlewares/validateId.js";

export const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/', getAllContactsController);

contactsRouter.get('/:contactId', validateId, getContactByIdController);

contactsRouter.post('/', jsonParser, validateBody(createContactSchema), createContactController);

contactsRouter.delete('/:contactId', validateId, deleteContactController);

contactsRouter.put('/:contactId', validateId, jsonParser, validateBody(createContactSchema), replaceContactController);

contactsRouter.patch('/:contactId', validateId, jsonParser, validateBody(updateContactSchema), updateContactController);