import mongoose from "mongoose";

const carsSchema = new mongoose.Schema({
    model: {
        type: String,
        unique: true,
        required: [true, 'Model is required']
    },
    company: {
        type: String,
        required: [true, 'Company name is required']
    },
    cartype: {
        type: String,
        required: [true, 'Company name is required']
    },
    year: {
        type: Number,
        required: [true, "Year is required"],
        min: [1900, "Invalid year"],
        max: [new Date().getFullYear(), "Invalid year"]
    },
    milage: {
        type: Number,
        required: [true, "Mileage is required"]
    },
    bootspace: {
        type: Number,
        required: [true, "Bootspace is required"]
    },
    seatingcapacity: {
        type: Number,
        required: [true, "Seating capacity is required"]
    },
    enginetype: {
        type: String,
        required: [true, "Engine type is required"]
    },
    colors: {
        type: [String],
        required: [true, "At least one color is required"],
        
    },
    carphotos: [{
        id: { type: String, required: true },
        url: { type: String, required: true }
    }]
});

export const Car = mongoose.model("Car", carsSchema);
