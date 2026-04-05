import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Global validation middleware to handle validation results from express-validator.
 * Returns errors if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return next(
      new ApiError(400, "Validation failed.", extractedErrors)
    );
  }

  next();
};

export default validate;
