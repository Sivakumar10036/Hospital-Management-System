const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        doctor:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        dayOfWeek:
        {
            type: String,
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
            required: true
        },

        startTime:
        {
            type: String,
            required: true
        },

        endTime:
        {
            type: String,
            required: true
        },

        slotDuration:
        {
            type: Number,
            required: true,
            default: 30,
            min: 5
        },

        breakStart:
        {
            type: String,
            default: ""
        },

        breakEnd:
        {
            type: String,
            default: ""
        },

        isAvailable:
        {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

scheduleSchema.index(
    {
        doctor: 1,
        dayOfWeek: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Schedule", scheduleSchema);