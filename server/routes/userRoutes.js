import  express from "express";
import * as userController from "../controllers/userController.js";
import  auth from "../middleware/authMiddleware.js";
import  authorize from "../middleware/roleMiddleware.js";
import  validate from "../middleware/validateMiddleware.js";
import  {
  createUserValidator,
  updateUserValidator,
} from "../validators/userValidator.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

// All user routes require authentication
router.use(auth);

// PATCH /api/users/change-password (any authenticated user)
router.patch("/change-password", userController.changePassword);

// GET /api/users (admin only)
router.get(
  "/",
  authorize(ROLES.ADMIN),
  userController.getAll
);

// GET /api/users/:id (admin only)
router.get(
  "/:id",
  authorize(ROLES.ADMIN),
  userController.getById
);

// POST /api/users (admin only)
router.post(
  "/",
  // authorize(ROLES.ADMIN),
  createUserValidator,
  validate,
  userController.create
);

// PUT /api/users/:id (admin only)
router.put(
  "/:id",
  authorize(ROLES.ADMIN),
  updateUserValidator,
  validate,
  userController.update
);

// DELETE /api/users/:id (admin only, soft delete)
router.delete("/:id", authorize(ROLES.ADMIN), userController.deleteUser);

export default router;
