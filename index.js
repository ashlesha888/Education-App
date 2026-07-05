import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import instructorDashboardRoutes from "./routes/instructorDashboardRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/enrollment", enrollmentRoutes);
app.use("/api/v1/instructor-dashboard",instructorDashboardRoutes);
app.use("/api/v1/student", studentDashboardRoutes);
app.use("/api/v1/search", searchRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});