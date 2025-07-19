import Joi from "joi";

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
    password: Joi.string().required(),
});