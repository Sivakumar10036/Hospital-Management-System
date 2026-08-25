const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
    __dirname,
    "../../uploads/doctors"
);

if (!fs.existsSync(uploadDirectory))
{
    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );
}

const storage = multer.diskStorage(
    {
        destination: (request, file, callback) =>
        {
            callback(null, uploadDirectory);
        },

        filename: (request, file, callback) =>
        {
            const extension = path.extname(file.originalname);

            const uniqueFileName =
                `doctor-${Date.now()}-${Math.round(Math.random() * 100000)}${extension}`;

            callback(null, uniqueFileName);
        }
    }
);

const fileFilter = (request, file, callback) =>
{
    const allowedTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype))
    {
        callback(null, true);
    }
    else
    {
        callback(
            new Error("Only JPG, PNG and WEBP images are allowed"),
            false
        );
    }
};

const uploadDoctorPhoto = multer(
    {
        storage,
        fileFilter,
        limits:
        {
            fileSize: 5 * 1024 * 1024
        }
    }
);

module.exports = uploadDoctorPhoto;