import express from "express";
import * as authController from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", ...registerValidator, validate, authController.register);

// POST /api/auth/login
router.post("/login", ...loginValidator, validate, authController.login);

// GET /api/auth/me (protected)
router.get("/me", auth, authController.getMe);

export default router;
