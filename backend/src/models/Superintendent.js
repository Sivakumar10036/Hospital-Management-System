const mongoose = require("mongoose");

const superintendentSchema = new mongoose.Schema(
    {
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        superintendentId:
        {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        employeeId:
        {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        designation:
        {
            type: String,
            default: "Hospital Superintendent",
            trim: true
        },

        department:
        {
            type: String,
            default: "Hospital Administration",
            trim: true
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Superintendent", superintendentSchema);