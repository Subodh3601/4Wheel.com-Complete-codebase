import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First Name Is Required!"],
        minLength: [2, "First Name Must Contain At Least 2 Characters!"],
    },
    lastname: {
        type: String,
        required: [true, "Last Name Is Required!"],
        minLength: [2, "Last Name Must Contain At Least 2 Characters!"],
    },
    email: {
        type: String,
        unique:true,
        required: [true, "Email Is Required!"],
        validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
        type: String,
        unique:true,
        required: [true, "Phone Is Required!"],
        minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    },
   
    password: {
        type: String,
        required: [true, "Password Is Required!"],
        minLength: [4, "Password Must Contain At Least 8 Characters!"],
        select: false, //this will prevent password to show in get request 
    },
    role: {
        type: String,
        required: [true, "User Role Required!"],
        enum: ["user", "admin"],
    },
    photo: {
        url: { type: String, required: true }
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    try {
       
        const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES,
        });
        return token;
    } catch (error) {
        console.error('JWT signing error:', error);
        throw new Error('Failed to generate JWT token');
    }
};

export const User = mongoose.model("User", userSchema);
