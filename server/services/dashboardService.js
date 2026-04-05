import Record from"../models/Record.js";

export const getSummary = async () => {
  const [summary] = await Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
        totalRecords: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: { $round: ["$totalIncome", 2] },
        totalExpense: { $round: ["$totalExpense", 2] },
        netBalance: {
          $round: [{ $subtract: ["$totalIncome", "$totalExpense"] }, 2],
        },
        totalRecords: 1,
      },
    },
  ]);

  return (
    summary || {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      totalRecords: 0,
    }
  );
};

export const getCategoryTotals = async () => {
  const totals = await Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: { $round: ["$total", 2] },
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return totals;
};

export const getMonthlyTrends = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const trends = await Record.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: { $round: ["$total", 2] },
        count: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  return trends;
};

export const getWeeklyTrends = async () => {
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const trends = await Record.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: eightWeeksAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        week: "$_id.week",
        type: "$_id.type",
        total: { $round: ["$total", 2] },
        count: 1,
      },
    },
    { $sort: { year: 1, week: 1 } },
  ]);

  return trends;
};

export const getRecentActivity = async (limit = 10) => {
  const records = await Record.find({ isDeleted: false })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);

  return records;
};

export const getTopCategories = async (limit = 5) => {
  const categories = await Record.aggregate([
    { $match: { isDeleted: false, type: "expense" } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: { $round: ["$total", 2] },
        count: 1,
        avgAmount: { $round: ["$avgAmount", 2] },
      },
    },
    { $sort: { total: -1 } },
    { $limit: limit },
  ]);

  return categories;
};
