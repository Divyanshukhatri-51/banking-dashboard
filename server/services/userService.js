import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { PAGINATION_DEFAULTS } from "../utils/constants.js";

export const getAll = async ({ page, limit, search, role, status }) => {
  page = Math.max(1, parseInt(page) || PAGINATION_DEFAULTS.PAGE);
  limit = Math.min(
    parseInt(limit) || PAGINATION_DEFAULTS.LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) filter.role = role;
  if (status) filter.status = status;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
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

export const getById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  return user;
};

export const create = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }
  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      throw new ApiError(409, "Admin already exists, Admin can be only one.");
    }
  }

  const user = await User.create({ name, email, password, role });
  return user;
};

export const update = async (userId, updateData) => {
  // Prevent password update through this method
  delete updateData.password;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const softDelete = async (userId, currentUserId) => {
  if (userId === currentUserId.toString()) {
    throw new ApiError(400, "You cannot delete your own account.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true, status: "inactive" },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully." };
};
