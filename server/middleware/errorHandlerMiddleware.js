import ApiError from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not an ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || []);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, "Validation Error", messages);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `Duplicate value for '${field}'. This ${field} already exists.`);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    statusCode: statusCode,
    message: error.message || "Internal Server Error",
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  console.error(`[ERROR] ${statusCode} - ${response.message}`);

  res.status(statusCode).json(response);
};

export default errorHandler;
