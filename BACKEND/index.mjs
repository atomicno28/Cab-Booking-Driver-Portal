import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import userRoutes from "./routes/route.mjs";
import cors from "cors";

dotenv.config();

const app = express();

// MIDDLEWAREs..
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const PORT = 3000;

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT},`);
});
