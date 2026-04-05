import * as userService from "../services/userService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = async (req, res) => {
  const { page, limit, search, role, status } = req.query;
  const result = await userService.getAll({
    page,
    limit,
    search,
    role,
    status,
  });

  res.status(200).json(ApiResponse(200, result, "Users retrieved successfully."));
};

export const getById = async (req, res) => {
  const user = await userService.getById(req.params.id);

  res.status(200).json(ApiResponse(200, { user }, "User retrieved successfully."));
};

export const create = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await userService.create({ name, email, password, role });

  res.status(201).json(ApiResponse(201, { user }, "User created successfully."));
};

export const update = async (req, res) => {
  const user = await userService.update(req.params.id, req.body);

  res.status(200).json(ApiResponse(200, { user }, "User updated successfully."));
};

export const deleteUser = async (req, res) => {
  await userService.softDelete(req.params.id, req.user._id);

  res.status(200).json(ApiResponse(200, null, "User deleted successfully."));
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user._id, {
    currentPassword,
    newPassword,
  });

  res.status(200).json(ApiResponse(200, null, result.message));
};
