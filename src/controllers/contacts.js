import createHttpError from "http-errors";
import { createContact, getAllContacts, getContactById } from "../services/contacts.js";

export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    });
};

export const getContactByIdController = async (req, res) => {
    const {id} = req.params;
    const contact = await getContactById(id);
    if(!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact by ${id}`,
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