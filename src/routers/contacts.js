import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, replaceContactController, updateContactController,  } from "../controllers/contacts.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateId } from "../middlewares/validateId.js";
import { upload } from "../middlewares/upload.js";

export const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/', getAllContactsController);

contactsRouter.get('/:contactId', validateId, getContactByIdController);

contactsRouter.post('/', jsonParser, upload.single('photo'), validateBody(createContactSchema), createContactController);

contactsRouter.delete('/:contactId', validateId, deleteContactController);

contactsRouter.put('/:contactId', validateId, jsonParser, upload.single('photo'), validateBody(createContactSchema), replaceContactController);

contactsRouter.patch('/:contactId', validateId, jsonParser, upload.single('photo'), validateBody(updateContactSchema), updateContactController);