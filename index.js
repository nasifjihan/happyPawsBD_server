import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import Routes from "./server/route.js";
import Connection from "./database/db.js";
import { isAllowedOrigin } from "./utils/origin.js";

const app = express();

// app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (!isAllowedOrigin(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  })
);

app.use("/", Routes);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Ensures the server is accessible from outside the local environment
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

Connection(USERNAME, PASSWORD);

// Or if you have an "images" directory
// app.use('/images', express.static(path.join(__dirname, 'images')));

app.get("/", (req, res) => {
  res.send("Hello Paws!");
});

app.listen(PORT, HOST, () =>
  console.log(
    `Happy Paws BD Server is running successfully on PORT ${PORT} & HOST ${HOST}`
  )
);
