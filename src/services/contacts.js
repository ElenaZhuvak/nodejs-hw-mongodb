import { SORT_ORDER } from '../constants/constants.js';
import Contact from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// ******************************
export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
  userId,
}) {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find({userId});

  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite', filter.isFavourite);
  }

  if (typeof filter.contactType === 'string' && filter.contactType) {
    contactQuery.where('contactType', filter.contactType);
  }

  const [contactCount, contacts] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
  ]);

  const paginationData = calculatePaginationData(contactCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
}

// ******************************
export async function getContactById(contactId, userId) {
  const contact = await Contact.findOne({_id: contactId, userId});
  return contact;
}

// ******************************
export async function createContact(payload) {
  const contact = await Contact.create(payload);
  return contact;
}

// ******************************
export async function deleteContact(contactId, userId) {
  const contact = await Contact.findOneAndDelete({_id: contactId, userId});
  return contact;
}

// ******************************
export async function replaceContact(contactId, contact, userId) {
  const result = await Contact.findOneAndReplace({_id: contactId, userId}, {...contact, userId}, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
};

// ******************************
export async function updateContact(contactId, contact, userId) {
  const result = await Contact.findOneAndUpdate({_id: contactId, userId}, {...contact, userId}, {
    new: true,
  });
  return result;
}
