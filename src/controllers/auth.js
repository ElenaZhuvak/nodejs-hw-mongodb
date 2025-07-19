import { registerUser } from "../services/auth.js";

export async function registerUserController(req, res) {
    const payload = req.body;
    if (!payload.name || !payload.email || !payload.password) {
        return res.status(400).json({
            message: 'Name, email and password are required'
        });
    }

    // if(email === payload.email) {
    //     throw createHttpError(409, 'Email in use');
    // }
    
    const user = await registerUser(payload);
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user
    });
}