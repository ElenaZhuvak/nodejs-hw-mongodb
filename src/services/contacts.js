import Contact from '../db/models/contact.js';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (!contact) {
    return res.status(404).json({
      message: 'Contact not found',
    });
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};
