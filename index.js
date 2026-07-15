import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/database.js";
import "./config/validateEnv.js";

// Middlewares
import { apiLimiter } from "./middlewares/rateLimitMiddleware.js";
import errorHandler from "./middlewares/errorHandler.js";

// Utils
import NotFoundError from "./utils/errors/NotFoundError.js";

// Routes
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
import tagRoutes from "./routes/tagRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

// Database

connectDB();

// CORS

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_PROD
    : process.env.FRONTEND_DEV;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Global Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  compression({
    level: 6,
    threshold: "1kb",
  })
);

app.use(hpp());

app.use(mongoSanitize());

app.use("/api", apiLimiter);

// Routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/enrollment", enrollmentRoutes);
app.use("/api/v1/instructor-dashboard", instructorDashboardRoutes);
app.use("/api/v1/student", studentDashboardRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Health Check

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully ",
  });
});

// 404 Handler
app.use((req, res, next) => {
  next(
    new NotFoundError(
      `Cannot find ${req.originalUrl}`
    )
  );
});

// Global Error Handler

app.use(errorHandler);

// Start Server

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});