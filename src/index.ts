import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import { verifyJWT } from "./middlewares/authMiddleware";


// [A1] What — Express server bootstrap — Why — API entrypoint — Result: auth + health endpoints

dotenv.config();

const app = express();

// Public: enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Public: health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "API is working" });
});

// Public: auth routes (register/login). Do NOT add verifyJWT here
app.use("/api/auth", authRoutes);

// Protected: example of protected routes (add verifyJWT explicitly)
// app.use("/api/students", verifyJWT, studentRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  // Fail fast if missing config
  // eslint-disable-next-line no-console
  console.error("MONGO_URI is not set in environment");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default app;


