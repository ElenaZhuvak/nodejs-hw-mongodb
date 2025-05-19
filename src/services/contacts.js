import Contact from '../db/models/contact.js';

export async function getAllContacts() {
  const contacts = await Contact.find();
  return contacts;
};

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
};

export async function createContact(payload) {
  const contact = await Contact.create(payload);
  return contact;
};

export async function deleteContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
};

export async function replaceContact(contactId, contact) {
  const result = await Contact.findByIdAndUpdate(contactId, contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  return {value: result.value, updatedExisting: result.lastErrorObject.updatedExisting};
};

export async function updateContact(contactId, contact) {
  const result = await Contact.findByIdAndUpdate(contactId, contact, {new: true});
  return result;
};
