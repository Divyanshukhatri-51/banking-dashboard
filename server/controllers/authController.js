import * as authService from "../services/authService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await authService.register({
      name,
      email,
      password,
      role,
    });

    res.status(201).json(ApiResponse(201, { user, token }, "User registered successfully."));
  } catch (error) {
    if (typeof next === "function") {
      next(error);
    } else {
      res.status(500).json(ApiResponse(500, null, error.message));
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });

    res.status(200).json(ApiResponse(200, { user, token }, "Login successful."));
  } catch (error) {
    if (typeof next === "function") {
      next(error);
    } else {
      res.status(500).json(ApiResponse(500, null, error.message));
    }
  }
};

export const getMe = async (req, res, next) => {
  res.status(200).json(ApiResponse(200, { user: req.user }, "User profile retrieved."));
};
