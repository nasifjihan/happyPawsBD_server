import { isAllowedOrigin } from "../utils/origin.js";

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (!isAllowedOrigin(origin)) {
      return callback(
        new Error(
          "The CORS policy for this site does not allow access from the specified Origin."
        ),
        false
      );
    }

    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
