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
import { parsedSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

import fs from 'node:fs/promises';
import path from 'node:path';

// ******************************
export async function getAllContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parsedSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user.id,
  });

  if (page > contacts.totalPages) {
    return res.status(400).json({
      status: 400,
      message: `Page ${page} does not exist. Total pages: ${contacts.totalPages}`,
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

// ******************************
export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user.id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact by ${contactId}`,
    data: contact,
  });
}

// ******************************
export async function createContactController(req, res) {
  let photo = null;

  if (getEnvVar('CLOUDINARY_FEATURE_FLAG') === 'true') {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photo = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src/uploads/photos', req.file.filename),
    );
    photo = `http://localhost:3000/photos/${req.file.filename}`;
  }

  const payload = req.body;
  if (!payload.name || !payload.phoneNumber || !payload.contactType) {
    return res.status(400).json({
      message: 'Name, phone number and contact type are required',
    });
  }

  const contact = await createContact({
    ...req.body,
    photo,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

// ******************************
export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
}

// ******************************
export async function replaceContactController(req, res) {
  const { contactId } = req.params;
  const contact = req.body;
  const userId = req.user.id;
  if (req.file) {
    if(getEnvVar('CLOUDINARY_FEATURE_FLAG') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      contact.photo = result.secure_url;
    } else {
      await fs.rename(req.file.path, path.resolve('src/uploads/photos', req.file.filename));
      contact.photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
  }
  const result = await replaceContact(contactId, contact, userId);

  if (result.updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Contact patched successfully',
      data: result.value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: result.value,
  });
}

// ******************************
export async function updateContactController(req, res) {
  const { contactId } = req.params;
  const contact = req.body;
  const userId = req.user.id;
  if (req.file) {
    if(getEnvVar('CLOUDINARY_FEATURE_FLAG') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      contact.photo = result.secure_url;
    } else {
      await fs.rename(req.file.path, path.resolve('src/uploads/photos', req.file.filename));
      contact.photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
  }

  const result = await updateContact(contactId, contact, userId);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: result,
  });
}
