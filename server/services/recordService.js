import Record from "../models/Record.js";
import ApiError from "../utils/ApiError.js";
import { PAGINATION_DEFAULTS } from "../utils/constants.js";

export const create = async (data, userId) => {
  const record = await Record.create({
    ...data,
    createdBy: userId,
  });
  return record;
};

export const getAll = async ({
  page,
  limit,
  type,
  category,
  startDate,
  endDate,
  search,
  sortBy = "date",
  sortOrder = "desc",
}) => {
  page = Math.max(1, parseInt(page) || PAGINATION_DEFAULTS.PAGE);
  limit = Math.min(
    parseInt(limit) || PAGINATION_DEFAULTS.LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Search in notes
  if (search) {
    filter.notes = { $regex: search, $options: "i" };
  }

  // Build sort
  const allowedSortFields = ["date", "amount", "createdAt", "type", "category"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";
  const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  const [records, total] = await Promise.all([
    Record.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Record.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export const getById = async (recordId) => {
  const record = await Record.findById(recordId).populate(
    "createdBy",
    "name email"
  );

  if (!record) {
    throw new ApiError(404, "Record not found.");
  }

  return record;
};

export const update = async (recordId, updateData) => {
  // Don't allow changing createdBy
  delete updateData.createdBy;

  const record = await Record.findByIdAndUpdate(recordId, updateData, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");

  if (!record) {
    throw new ApiError(404, "Record not found.");
  }

  return record;
};

export const softDelete = async (recordId) => {
  const record = await Record.findByIdAndUpdate(
    recordId,
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, "Record not found.");
  }

  return record;
};
