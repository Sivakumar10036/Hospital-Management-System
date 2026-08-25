const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
            trim: true
        },

        email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password:
        {
            type: String,
            required: true,
            minlength: 6
        },

        phone:
        {
            type: String,
            required: true,
            trim: true
        },

        role:
        {
            type: String,
            enum: ["ADMIN", "SUPERINTENDENT", "DOCTOR", "PATIENT"],
            default: "PATIENT"
        },

        profilePhoto:
        {
            type: String,
            default: ""
        },

        isActive:
        {
            type: Boolean,
            default: true
        },

        lastLogin:
        {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);