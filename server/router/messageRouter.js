import express from "express";
import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/send", catchAsyncErrors(async (req, res, next) => {
    const { firstname, lastname, email, phone, message } = req.body;
    if (!firstname || !lastname || !email || !phone || !message) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    await Message.create({ firstname, lastname, email, phone, message });
    res.status(200).json({
        success: true,
        message: "Message Sent!",
    });
}));

router.get('/getall',isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const message = await Message.find();
    res.status(200).json({success:true,message})
}))

router.delete('/delete/:id', isAdminAuthenticated, catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
        return res.status(404).json({ success: false, message: "Message not found" });
    }
    await message.deleteOne();
    res.status(200).json({ success: true, message: "Message deleted successfully" });
}))

export default router;
