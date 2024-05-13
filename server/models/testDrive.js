import mongoose from "mongoose";


const testDriveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    firstname: {
        type: String,
        required: [true, 'name is required'],
         minLength: [2, "first name Must Contain Exact 2 Digits!"],
    },
    lastname: {
        type: String,
        minLength: [2, "last name Must Contain Exact 2 Digits!"],
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Validate exactly 10 digits
            },
            message: "Phone number must contain exactly 10 digits"
        }
    },
    date: {
        type: String,
        required: [true, 'testdrive date is required'],


    },
    time: {
        type: String,
        required: [true, "testdrive time is required"]
    },
    location: {
        type: String,
        required: [true, "testdrive location is required"]
    },
    company: {
        type: String,
        required: [true, "testdrive car is required"]

    },
    model: {
        type: String,
        required: [true, "testdrive car is required"]

    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }

})

export const TestDrive = mongoose.model("TestDrive", testDriveSchema);
