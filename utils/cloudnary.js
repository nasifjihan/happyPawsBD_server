import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (file, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });

const createCloudinarySingleUpload = ({ fieldName, folder }) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxUploadSizeInBytes },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, async (error) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.file) {
        next();
        return;
      }

      try {
        const result = await uploadImageToCloudinary(req.file, folder);
        req.file.path = result?.secure_url ?? result?.url;
        req.file.filename = result?.public_id;
        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
};

const uploadFoundPets = createCloudinarySingleUpload({
  fieldName: "petPicture",
  folder: "found_pets",
});

const uploadLostPets = createCloudinarySingleUpload({
  fieldName: "petPicture",
  folder: "lost_pets",
});

const uploadRescueAlerts = createCloudinarySingleUpload({
  fieldName: "photo",
  folder: "rescue_alerts",
});

const uploadPetInfoAnimals = createCloudinarySingleUpload({
  fieldName: "image",
  folder: "pet_info/animals",
});

const uploadPetInfoBreeds = createCloudinarySingleUpload({
  fieldName: "image",
  folder: "pet_info/breeds",
});

export {
  uploadFoundPets,
  uploadLostPets,
  uploadRescueAlerts,
  uploadPetInfoAnimals,
  uploadPetInfoBreeds,
};
