import AppError from "../utils/errors/AppError.js";
import { isDevelopment } from "../utils/errors/errorResponse.js";
import ValidationError from "../utils/errors/ValidationError.js";
import AuthenticationError
from "../utils/errors/AuthenticationError.js";
import multer from "multer";
import {
  logError,
} from "../utils/logger.js";



// --- Mongoose Error Parsers ---

const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}.`, 400);
};

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists.`, 400);
};

const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((e) => e.message)
    .join(", ");
  return new ValidationError(message);
};

// --- Environment Response Helpers ---

const sendDevelopmentError = (err, res) => {
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProductionError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Log unknown programatic or 3rd party errors safely in production
  logError(err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong.",
  });
};

// --- Main Global Error Middleware ---

const errorHandler = (err, req, res, next) => {
  // Create a mutable copy of the error object
let error = { ...err };

error.message = err.message;
error.statusCode = err.statusCode || 500;
error.status = err.status || "error";

  // Fallback defaults
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  // Parse specific Mongoose Database Errors
  if (error.name === "CastError") error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateKey(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
    if (
  err.name ===
  "JsonWebTokenError"
) {

  err =
    handleJWTError();

}

if (
  err.name ===
  "TokenExpiredError"
) {

  err =
    handleJWTExpired();

}
if (
  err instanceof
  multer.MulterError
) {

  err =
    handleMulterError(
      err
    );

}
  // Send environment-specific response
  if (isDevelopment()) {
    return sendDevelopmentError(error, res);
  }
  
  return sendProductionError(error, res);
};

const handleJWTError =
() => {

  return new AuthenticationError(
    "Invalid authentication token."
  );

};

const handleJWTExpired =
() => {

  return new AuthenticationError(
    "Authentication token has expired."
  );

};

const handleMulterError =
(
  err
)=>{

  return new ValidationError(
    err.message
  );

};

export default errorHandler;