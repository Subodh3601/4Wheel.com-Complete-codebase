import express from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import { v2 as cloudinary } from 'cloudinary';

import { isAdminAuthenticated, isUserAuthenticated } from '../middlewares/auth.js'

const router = express.Router();

router.post("/register", catchAsyncErrors(async (req, res, next) => {
    const { firstname, lastname, email, phone, password, role } =
        req.body;
    console.log("req.files", req.files)
    if (!req.files) {
        return next(new ErrorHandler("User Photo needed", 400))
    }
    const { photo } = req.files;
    const allowedFormates = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedFormates.includes(photo.mimetype)) { // .mimetype gives the file extension
        return next(new ErrorHandler("file format not supported", 400))
    }


    if (
        !firstname ||
        !lastname ||
        !email ||
        !phone ||
        !password ||
        !role
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({ email });
    const phoneFound = await User.findOne({ phone });
    if (isRegistered || phoneFound) {
        return next(new ErrorHandler(" already Registered! with email or phone", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    let responseObj;
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error('Cloudinary Response Error:', cloudinaryResponse.error || "unknown error");
        return next(new ErrorHandler("Error uploading photos to Cloudinary", 500));
    } else {
        responseObj = {
            url: cloudinaryResponse.secure_url
        };
    }

    const user = await User.create({
        firstname,
        lastname,
        email,
        phone,
        password,
        role,
        photo: responseObj

    });
    res.status(200).json({
        success: true,
        message: "user Registered"
    });
    generateToken(user, "User Registered!", 200, res);
}));



router.post("/login", catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmpassword, role } = req.body;
    if (!email || !password || !confirmpassword || !role) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    if (password !== confirmpassword) {
        return next(
            new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
        );
    }
    const user = await User.findOne({ email }).select("+password"); // .select is use to get the values of fields whose select is false in schema

    if (!user) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    const isPasswordMatch = await user.comparePassword(password); //this function we defined in userschema
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler(`User Not Found With This Role!`, 400));
    }
    // res.status(200).json({
    //     success: true,
    //     message: "user logged In"
    // }); 
    generateToken(user, "Login Successfully!", 201, res);
}));

router.put('/updateprofile/:id', isUserAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { firstname, lastname, phone } = req.body;
    // console.log("req.body",req.body)

    try {
        let user = await User.findById(id);
        // console.log("userrrrrrrrrrr", user)
        if (!user) {
            return next(new ErrorHandler("User not found", 400))
        }

        const updatedUser = await User.findByIdAndUpdate(id, { firstname, lastname, phone }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        console.log("updatedUser", updatedUser)
        res.status(200).json({ success: true, message: "Profile updated", updatedUser })
    } catch (error) {
        console.log("error in updation",error)
        return next(new ErrorHandler("error in updating",400))
    }
}))


router.post('/admin/addnew', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const { firstname, lastname, email, phone, password } =
        req.body;
    if (
        !firstname ||
        !lastname ||
        !email ||
        !phone ||
        !password
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
    }

    const admin = await User.create({
        firstname,
        lastname,
        email,
        phone,
        password,
        role: "admin",
    });
    res.status(200).json({
        success: true,
        message: "New Admin Registered",
        admin,
    });
}))



router.get('/admin/me', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
}))
router.get('/rider/me', isUserAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
}))

// Logout function for dashboard admin
router.get('/admin/logout', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    res
        .status(201)
        .cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Admin Logged Out Successfully.",
        });
}));


// Logout function for frontend user
router.get('/rider/logout', isUserAuthenticated, catchAsyncErrors(async (req, res, next) => {
    res
        .status(201)
        .cookie("userToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "user Logged Out Successfully.",
        });
}))



export default router;