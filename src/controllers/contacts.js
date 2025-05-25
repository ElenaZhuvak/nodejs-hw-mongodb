import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  replaceContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export async function getAllContactsController(req, res) {
  
  const {page, perPage} = parsePaginationParams(req.query);
  const contacts = await getAllContacts({page, perPage});

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact by ${contactId}`,
    data: contact,
  });
};

export async function createContactController(req, res) {
  const payload = req.body;
  if (!payload.name || !payload.phoneNumber || !payload.contactType) {
    return res.status(400).json({
      message: 'Name, phone number and contact type are required',
    });
  }

  const contact = await createContact(payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export async function replaceContactController(req, res) {
  const { contactId } = req.params;
  const contact = req.body;
  const result = await replaceContact(contactId, contact);

  if (result.updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: result.value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: result.value,
  });
};

export async function updateContactController(req, res) {
  const { contactId } = req.params;
  const contact = req.body;
  const result = await updateContact(contactId, contact);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
