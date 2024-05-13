import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import { v2 as cloudinary } from 'cloudinary';

import messageRouter from './router/messageRouter.js';
import userRouter from './router/userRouter.js'
import carRouter from './router/carsRouter.js'
import testDriveRouter from './router/testDriveRouter.js'


import { errorMiddleware } from './middlewares/errorMiddleware.js'

const app = express();
app.use(cors({
    // origin: ["https://4wheel-admin-frontend.netlify.app", "https://4-wheel.netlify.app"],
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/temp/',
    })
);

app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/testdrive', testDriveRouter)

app.use(errorMiddleware) // note error middleware should be used at the last
export default app;
