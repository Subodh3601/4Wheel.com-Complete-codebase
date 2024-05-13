import express from 'express'
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/errorMiddleware.js';
import { Car } from '../models/carsSchema.js';
import { v2 as cloudinary } from 'cloudinary';
import { isAdminAuthenticated } from '../middlewares/auth.js';


const router = express.Router();


router.get('/', catchAsyncErrors(async (req, res, next) => {
    const cars = await Car.find();
    res.status(200).json({
        success: true,
        cars,
    });
}))

router.post('/addnew', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Car Photo needed",400))
    }
    // console.log("req.files", req.files)
    const { carphotos } = req.files;
    

    const allowedFormates = ['image/png', 'image/jpeg', 'image/webp'];
    for (const photo of carphotos) {
        if (!allowedFormates.includes(photo.mimetype)) { // .mimetype gives the file extension
            return next(new ErrorHandler("file format not supported", 400))
        }
    }
    const {
        model,
        company,
        year,
        milage,
        bootspace,
        seatingcapacity,
        enginetype,
        cartype,
        // fueltankcapacity,
        // tyre,
        // windows,
        // pushbuttonstart,
        // rearacwent,
        // sunroof,
        // infotainment,
        // groundclearance,
        // length,
        // width,
        colors,
        // other
    } = req.body

    const col = JSON.parse(colors);
    // console.log("colors",typeof(col), col)
    
    if (!model ||
        !company ||
        !year ||
        !milage ||
        !bootspace ||
        !seatingcapacity ||
        !enginetype ||
        !cartype||
        // !fueltankcapacity||
        // !tyre||
        // !windows||
        // !pushbuttonstart||
        // !rearacwent||
        // !sunroof||
        // !infotainment||
        // !groundclearance||
        // !length||
        // !width||
        !colors
        // !other
    ) {
        return next(new ErrorHandler("fill the complete form", 400))

    }
    
    const isRegistered = await Car.findOne({ model });
    if (isRegistered) {
        return next(new ErrorHandler("car already added with this model", 400))
    }

    //post in cloudinary
    try {
        let cloudinaryResponses = [];
        for (const photo of carphotos) {
            const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error('Cloudinary Response Error:', cloudinaryResponse.error || "unknown error");
                return next(new ErrorHandler("Error uploading photos to Cloudinary", 500));
            } else {
                const responseObj = {
                    id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url
                };
                cloudinaryResponses.push(responseObj);
                // console.log("Cloudinary Response Object:", responseObj); // Log the response object
                // console.log("Cloudinary Response id:", cloudinaryResponse.public_id); // Log the public_id
                // console.log("Cloudinary Response url:", cloudinaryResponse.secure_url); // Log the secure_url
            }
        }

        const car = await Car.create({
            model,
            company,
            year,
            milage,
            bootspace,
            seatingcapacity,
            enginetype,
            cartype,
            // fueltankcapacity,
            // tyre,
            // window,
            // pushbuttonstart,
            // rearacwent,
            // sunroof,
            // infotainment,
            // groundclearance,
            // length,
            // width,
            colors:col,
            // other,
            carphotos: cloudinaryResponses
        })


        return res.status(200).json({
            success: true,
            message: "New car detail saved",
            car,
        })
    } catch (error) {
        console.error('Error creating car:', error);
        return next(new ErrorHandler("Failed to add new car", 500));
    }
}))

export default router;