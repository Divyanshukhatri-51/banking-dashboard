import * as dashboardService from "../services/dashboardService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getSummary = async (req, res) => {
  const summary = await dashboardService.getSummary();

  res.status(200).json(ApiResponse(200, { summary }, "Dashboard summary retrieved."));
};

export const getCategoryTotals = async (req, res) => {
  const categories = await dashboardService.getCategoryTotals();

  res.status(200).json(ApiResponse(200, { categories }, "Category totals retrieved."));
};

export const getMonthlyTrends = async (req, res) => {
  const trends = await dashboardService.getMonthlyTrends();

  res.status(200).json(ApiResponse(200, { trends }, "Monthly trends retrieved."));
};

export const getWeeklyTrends = async (req, res) => {
  const trends = await dashboardService.getWeeklyTrends();

  res.status(200).json(ApiResponse(200, { trends }, "Weekly trends retrieved."));
};

export const getRecentActivity = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const records = await dashboardService.getRecentActivity(limit);

  res.status(200).json(ApiResponse(200, { records }, "Recent activity retrieved."));
};

export const getTopCategories = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const categories = await dashboardService.getTopCategories(limit);

  res.status(200).json(ApiResponse(200, { categories }, "Top categories retrieved."));
};
