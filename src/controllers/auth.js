import { THIRTY_DAYS } from "../constants/constants.js";
import { loginUser, logoutUser, refreshUser, registerUser, requestResetPassword, resetPassword} from "../services/auth.js";

// ****** RegisterController
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

// ******* LoginController
export async function loginUserController(req, res) {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS)
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS)
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        }
    });
}

// ****** RefreshController
function setupSession(res, session) {
    res.cookie('refreshToken', session.refreshToken, {httpOnly: true, expires: new Date(Date.now() + THIRTY_DAYS)});
    res.cookie('sessionId', session._id, {httpOnly: true, expires: new Date(Date.now() + THIRTY_DAYS)});
}

export async function refreshUserController(req, res) {
    const session = await refreshUser({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken
    });
    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        }
    });
}

// ****** LogoutController
export async function logoutUserController(req, res) {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
}

// ****** Request Reset Password Email
export async function requestResetPasswordController(req, res) {
    await requestResetPassword(req.body.email);
    res.json({
        status: 200,
        message: 'Reset password email was successfully sent',
        data: {},
    });
}

// ****** Reset Password
export async function resetPasswordController(req, res) {
    const {token, password} = req.body;
    await resetPassword(token, password);

    res.json({status: 200, message: ''});
}