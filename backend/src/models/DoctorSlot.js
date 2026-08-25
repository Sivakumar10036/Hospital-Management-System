const mongoose = require("mongoose");

const doctorSlotSchema =
    new mongoose.Schema(
        {
            doctor:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            date:
            {
                type: Date,
                required: true
            },

            startTime:
            {
                type: String,
                required: true,
                trim: true
            },

            endTime:
            {
                type: String,
                required: true,
                trim: true
            },

            status:
            {
                type: String,
                enum:
                [
                    "AVAILABLE",
                    "BOOKED",
                    "BLOCKED"
                ],
                default: "AVAILABLE"
            },

            appointment:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment",
                default: null
            }
        },
        {
            timestamps: true
        }
    );

doctorSlotSchema.index(
    {
        doctor: 1,
        date: 1,
        startTime: 1
    },
    {
        unique: true
    }
);

module.exports =
    mongoose.model(
        "DoctorSlot",
        doctorSlotSchema
    );