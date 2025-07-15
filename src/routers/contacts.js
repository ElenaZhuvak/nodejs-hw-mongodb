import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, replaceContactController, updateContactController,  } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateId } from "../middlewares/validateId.js";

export const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:contactId', validateId, ctrlWrapper(getContactByIdController));

contactsRouter.post('/', jsonParser, validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.delete('/:contactId', validateId, ctrlWrapper(deleteContactController));

contactsRouter.put('/:contactId', validateId, jsonParser, validateBody(createContactSchema), ctrlWrapper(replaceContactController));

contactsRouter.patch('/:contactId', validateId, jsonParser, validateBody(updateContactSchema), ctrlWrapper(updateContactController));