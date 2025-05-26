import { SORT_ORDER } from '../constants/constants.js';
import Contact from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = 'name'}) {

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactQuery = Contact.find();
  const contactCount = await Contact.find()
    .merge(contactQuery)
    .countDocuments();

  const contacts = await contactQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();

  const paginationData = calculatePaginationData(contactCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
}

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

export async function createContact(payload) {
  const contact = await Contact.create(payload);
  return contact;
}

export async function deleteContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}

export async function replaceContact(contactId, contact) {
  const result = await Contact.findByIdAndUpdate(contactId, contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
}

export async function updateContact(contactId, contact) {
  const result = await Contact.findByIdAndUpdate(contactId, contact, {
    new: true,
  });
  return result;
}
