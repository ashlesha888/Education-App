import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js"; // 1. Import rating router

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

// Mount All Backend Modules
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/rating", ratingRoutes); // 2. Mount rating routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Complete System online at port ${PORT}`));
