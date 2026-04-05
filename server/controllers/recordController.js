import * as recordService from "../services/recordService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const create = async (req, res) => {
  const record = await recordService.create(req.body, req.user._id);

  res.status(201).json(ApiResponse(201, { record }, "Record created successfully."));
};

export const getAll = async (req, res) => {
  const {
    page,
    limit,
    type,
    category,
    startDate,
    endDate,
    search,
    sortBy,
    sortOrder,
  } = req.query;

  const result = await recordService.getAll({
    page,
    limit,
    type,
    category,
    startDate,
    endDate,
    search,
    sortBy,
    sortOrder,
  });

  res.status(200).json(ApiResponse(200, result, "Records retrieved successfully."));
};

export const getById = async (req, res) => {
  const record = await recordService.getById(req.params.id);

  res.status(200).json(ApiResponse(200, { record }, "Record retrieved successfully."));
};

export const update = async (req, res) => {
  const record = await recordService.update(req.params.id, req.body);

  res.status(200).json(ApiResponse(200, { record }, "Record updated successfully."));
};

export const deleteRecord = async (req, res) => {
  await recordService.softDelete(req.params.id);

  res.status(200).json(ApiResponse(200, null, "Record deleted successfully."));
};
