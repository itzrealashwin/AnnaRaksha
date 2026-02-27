// src/middlewares/role.middleware.js
import AppError from "../utils/AppError.js";

/**
 * @deprecated Use `authorizeRoles` from auth.middleware.js instead.
 * Kept for backward compatibility only.
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401, "AUTH_REQUIRED"));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403,
          "FORBIDDEN"
        )
      );
    }
    next();
  };
};
