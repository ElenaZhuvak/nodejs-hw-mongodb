import mongoose from 'mongoose';

export const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        required: true,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
    }
}, {timestamps: true});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;