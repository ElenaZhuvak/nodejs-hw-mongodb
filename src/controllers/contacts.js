import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById } from "../services/contacts.js";

export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    });
};

export const getContactByIdController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await getContactById(contactId);
    if(!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact by ${contactId}`,
        data: contact
    });
};

export const createContactController = async (req, res) => {
    const payload = req.body;
    if(!payload.name || !payload.phoneNumber || !payload.contactType) {
        return res.status(400).json({
            message: 'Name, phone number and contact type are required'
        });
    }
    
    const contact = await createContact(payload);
    
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact
    });
};

export const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await deleteContact(contactId);

    if(!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
};