import express from 'express'
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { TestDrive } from "../models/testDrive.js";
import { isAdminAuthenticated, isUserAuthenticated } from '../middlewares/auth.js';


const router = express.Router();

router.post('/book', isUserAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const {
        firstname,
        lastname,
        phone,
        date,
        time,
        location,
        company,
        model,
    } = req.body;

    if (!firstname ||
        !lastname ||
        !phone ||
        !date ||
        !time ||
        !location ||
        !company ||
        !model
        ) {
        return next(new ErrorHandler("please fill the form", 400))
    }

    const testdrive = await TestDrive.findOne({ phone })
    if (testdrive) {
        console.log("user", testdrive)
        return next(new ErrorHandler("You have already booked a test drive", 400))

    }

    const userId = req.user.id;
    const testDrive = await TestDrive.create({
        user:userId,
        firstname,
        lastname,
        phone,
        date,
        time,
        location,
        company,
        model,
        status:"Pending",
    })

    
    res.status(200).json({ success: true, message: "test drive request send", testDrive })
}))

router.get('/', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const requestedTestDrive = await TestDrive.find()
    res.status(200).json({ success: true, requestedTestDrive })
}))

router.get('/rider/:id', isUserAuthenticated, catchAsyncErrors(async (req, res, next) => {

    try {
        const { id } = req.params;

        const userTestDrive = await TestDrive.find({ user: id });

        if (userTestDrive.length === 0) {
            res.status(200).json({ success: false});
        }

        res.status(200).json({ success: true, userTestDrive });
    } catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500));
    }
}))


router.put('/updatestatus/:id', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    let testDrive = await TestDrive.findById(id);
    if (!testDrive) {
        return next(new ErrorHandler("testDrive not found", 400))
    }
    testDrive = await TestDrive.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({ success: true, message: "status updated", testDrive })
}))


router.delete('/delete/:id',isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const testDrive = await TestDrive.findById(id)

    if (!testDrive) {
        return next(new ErrorHandler("testDrive not found", 400))
    }
    await TestDrive.deleteOne();
    res.status(200).json({ success: true, message: "testDrive deleted" })
}))

export default router