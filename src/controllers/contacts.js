import { getAllContacts, getContactById } from "../services/contacts.js";

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
        return res.status(404).json({
            message: 'Contact not found'
        });
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact by ${id}`,
        data: contact
    });
};