import {Schema, model} from 'mongoose';
import { validContactType } from '../../constants/constants.js';

export const contactSchema = new Schema({
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
        enum: validContactType,
        default: 'personal',
    }
}, {timestamps: true,
    versionKey: false,
});

const Contact = model('Contact', contactSchema);
export default Contact;