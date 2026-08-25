const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        patientId:
        {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        dateOfBirth:
        {
            type: Date,
            default: null
        },

        gender:
        {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Other"
        },

        bloodGroup:
        {
            type: String,
            enum:
            [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
                "Unknown"
            ],
            default: "Unknown"
        },

        address:
        {
            type: String,
            default: "",
            trim: true
        },

        emergencyContactName:
        {
            type: String,
            default: "",
            trim: true
        },

        emergencyContactPhone:
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

        medicalHistory:
        {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Patient", patientSchema);