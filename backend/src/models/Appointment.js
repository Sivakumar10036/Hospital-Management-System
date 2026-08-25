const mongoose = require("mongoose");

const appointmentSchema =
    new mongoose.Schema(
        {
            appointmentId:
            {
                type: String,
                required: true,
                unique: true,
                trim: true
            },

            patient:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Patient",
                required: true
            },

            doctor:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor",
                required: true
            },

            department:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Department",
                required: false
            },

            appointmentDate:
            {
                type: Date,
                required: true
            },

            appointmentTime:
            {
                type: String,
                required: true,
                trim: true
            },

            startTime:
            {
                type: String,
                default: "",
                trim: true
            },

            endTime:
            {
                type: String,
                default: "",
                trim: true
            },

            reason:
            {
                type: String,
                trim: true,
                maxlength: 500,
                default: ""
            },

            symptoms:
            {
                type: String,
                trim: true,
                maxlength: 500,
                default: ""
            },

            consultationFee:
            {
                type: Number,
                min: 0,
                default: 0
            },

            status:
            {
                type: String,
                enum:
                [
                    "BOOKED",
                    "CONFIRMED",
                    "COMPLETED",
                    "CANCELLED",
                    "NO_SHOW"
                ],
                default: "BOOKED"
            },

            cancelledBy:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            cancellationReason:
            {
                type: String,
                trim: true,
                maxlength: 500,
                default: ""
            }
        },
        {
            timestamps: true
        }
    );

appointmentSchema.index(
    {
        doctor: 1,
        appointmentDate: 1,
        appointmentTime: 1
    }
);

appointmentSchema.index(
    {
        patient: 1,
        appointmentDate: -1
    }
);

module.exports =
    mongoose.model(
        "Appointment",
        appointmentSchema
    );