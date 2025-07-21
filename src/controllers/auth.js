import { loginUser, registerUser } from "../services/auth.js";

export async function registerUserController(req, res) {
    const payload = req.body;
    if (!payload.name || !payload.email || !payload.password) {
        return res.status(400).json({
            message: 'Name, email and password are required'
        });
    }
    const user = await registerUser(payload);
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user
    });
}

export async function loginUserController(req, res) {
    const user = await loginUser(req.body);
    res.send({
        message: 'Logged in',
        data: user
    });
}