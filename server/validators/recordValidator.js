import { body } from "express-validator";
import { RECORD_TYPES, RECORD_CATEGORIES } from "../utils/constants.js";

export const createRecordValidator = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(Object.values(RECORD_TYPES))
    .withMessage(
      `Type must be one of: ${Object.values(RECORD_TYPES).join(", ")}`
    ),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(RECORD_CATEGORIES)
    .withMessage(`Category must be one of: ${RECORD_CATEGORIES.join(", ")}`),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

export const updateRecordValidator = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("type")
    .optional()
    .isIn(Object.values(RECORD_TYPES))
    .withMessage(
      `Type must be one of: ${Object.values(RECORD_TYPES).join(", ")}`
    ),
  body("category")
    .optional()
    .isIn(RECORD_CATEGORIES)
    .withMessage(`Category must be one of: ${RECORD_CATEGORIES.join(", ")}`),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];
