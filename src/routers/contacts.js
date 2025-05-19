import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getContactByIdController, getContactsController, replaceContactController, updateContactController,  } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateId } from "../middlewares/validateId.js";

export const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', validateId, ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', jsonParser, validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.delete('/contacts/:contactId', validateId, ctrlWrapper(deleteContactController));

contactsRouter.put('/contacts/:contactId', jsonParser, validateId, validateBody(updateContactSchema), ctrlWrapper(replaceContactController));

contactsRouter.patch('/contacts/:contactId', jsonParser, validateId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));