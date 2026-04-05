import  express from "express";
import * as recordController from "../controllers/recordController.js";
import  auth from "../middleware/authMiddleware.js";
import  authorize from "../middleware/roleMiddleware.js";
import  validate from "../middleware/validateMiddleware.js";
import  {
  createRecordValidator,
  updateRecordValidator,
} from "../validators/recordValidator.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

// All record routes require authentication
router.use(auth);

// GET /api/records (admin and analyst can view)
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  recordController.getAll
);

// GET /api/records/:id (admin and analyst can view)
router.get(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  recordController.getById
);

// POST /api/records (admin only)
router.post(
  "/",
  authorize(ROLES.ADMIN),
  createRecordValidator,
  validate,
  recordController.create
);

// PUT /api/records/:id (admin only)
router.put(
  "/:id",
  authorize(ROLES.ADMIN),
  updateRecordValidator,
  validate,
  recordController.update
);

// DELETE /api/records/:id (admin only, soft delete)
router.delete("/:id", authorize(ROLES.ADMIN), recordController.deleteRecord);

export default router;
