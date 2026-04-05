import  express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import  auth from "../middleware/authMiddleware.js";
import  authorize from "../middleware/roleMiddleware.js";
import  { ROLES } from "../utils/constants.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(auth);

// All roles can view dashboard data
const allRoles = [ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER];

// GET /api/dashboard/summary
router.get("/summary", authorize(...allRoles), dashboardController.getSummary);

// GET /api/dashboard/category-totals
router.get(
  "/category-totals",
  authorize(...allRoles),
  dashboardController.getCategoryTotals
);

// GET /api/dashboard/monthly-trends
router.get(
  "/monthly-trends",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  dashboardController.getMonthlyTrends
);

// GET /api/dashboard/weekly-trends
router.get(
  "/weekly-trends",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  dashboardController.getWeeklyTrends
);

// GET /api/dashboard/recent-activity
router.get(
  "/recent-activity",
  authorize(...allRoles),
  dashboardController.getRecentActivity
);

// GET /api/dashboard/top-categories
router.get(
  "/top-categories",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  dashboardController.getTopCategories
);

export default router;