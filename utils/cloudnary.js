import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
const maxUploadSizeInBytes = 5 * 1024 * 1024;

const imageFileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error("Only JPG, JPEG, and PNG images are allowed.");
    error.statusCode = 400;
    return callback(error);
  }

  return callback(null, true);
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage for the "found_pets" folder
const foundPetsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "found_pets",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Create storage for the "lost_pets" folder
const lostPetsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lost_pets",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const rescueAlertsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rescue_alerts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Create upload handlers for each folder
const uploadFoundPets = multer({
  storage: foundPetsStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxUploadSizeInBytes },
});
const uploadLostPets = multer({
  storage: lostPetsStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxUploadSizeInBytes },
});
const uploadRescueAlerts = multer({
  storage: rescueAlertsStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxUploadSizeInBytes },
});

export { uploadFoundPets, uploadLostPets, uploadRescueAlerts };
