class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.code === 11000) { // this comes when already has the value and want to recreate it but app need this value to be unique
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
         err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again!`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is expired, Try again!`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "CastError") { //when invalid data is send for with request ex=> expecting string you enter number
        const message = `Invalid ${err.path}`,
            err = new ErrorHandler(message, 400);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map((error) => error.message)
            .join(" ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        // message: err.message,
        message: errorMessage,
    });
};

export default ErrorHandler;
