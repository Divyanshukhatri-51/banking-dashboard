import ApiError from "../utils/ApiError.js";

/**
 * Role-based access control middleware.
 * Accepts one or more roles that are allowed to access the route.
 * Usage: authorize("admin", "analyst")
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Role '${req.user.role}' is not authorized for this action.`
        )
      );
    }

    next();
  };
};

export default authorize;
