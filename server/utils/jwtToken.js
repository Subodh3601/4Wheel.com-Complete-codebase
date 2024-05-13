export const generateToken = (user, message, statusCode, res) => {
    try {
        const token = user.generateJsonWebToken();
        console.log("token from generateJsonWebToken", token)
        // Determine the cookie name based on the user's role
        const cookieName = user.role === 'admin' ? 'adminToken' : 'userToken';

        res
            .status(statusCode)
            .cookie(cookieName, token, {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            })
            .json({
                success: true,
                message,
                user,
                token,
            });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Token generation failed',
            error: err.message,
        });
    }
};

