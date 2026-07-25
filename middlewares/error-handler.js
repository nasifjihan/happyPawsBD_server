import multer from "multer";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.message || "File upload failed.",
    });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Request body contains invalid JSON.",
    });
  }

  const statusCode = error.statusCode || error.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  return res.status(statusCode).json({
    message: error.message || "Something went wrong.",
    ...(isProduction ? {} : { stack: error.stack }),
  });
};
