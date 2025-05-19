import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export function validateId(req, res, next) {
    const {contactId} = req.params;

    if(!isValidObjectId(contactId)) {
        throw createHttpError(400, 'Not valid Id');
    }
    next();
}