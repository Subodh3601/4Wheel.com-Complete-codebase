import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users
export const isAdminAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
        const token = req.cookies.adminToken;
        // console.log("token------", req.cookies.adminToken)
        if (!token) {
            return next(
                new ErrorHandler("Dashboard User is not authenticated!", 400)
            );
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("decoded------", decoded)
        req.user = await User.findById(decoded.id);
        if (req.user.role !== "admin") {
            return next(
                new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
            );
        }
        next();
    }
);

// Middleware to authenticate frontend users
export const isUserAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
        const token = req.cookies.userToken;
        if (!token) {
            return next(new ErrorHandler("User is not authenticated!", 400));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (req.user.role !== "user") {
            return next(
                new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
            );
        }
        next();
    }
);
