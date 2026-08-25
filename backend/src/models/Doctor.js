const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        doctorId:
        {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        specialization:
        {
            type: String,
            required: true,
            trim: true
        },

        department:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        qualification:
        {
            type: String,
            required: true,
            trim: true
        },

        experience:
        {
            type: Number,
            required: true,
            min: 0
        },

        consultationFee:
        {
            type: Number,
            required: true,
            min: 0
        },

        about:
        {
            type: String,
            default: "",
            trim: true
        },

        profilePhoto:
        {
            type: String,
            default: ""
        },

        phone:
        {
            type: String,
            default: ""
        },

        availableDays:
        {
            type: [String],
            enum:
            [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            default: []
        },

        isAvailable:
        {
            type: Boolean,
            default: true
        },

        isActive:
        {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Doctor", doctorSchema);