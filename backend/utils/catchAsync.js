// src/utils/catchAsync.js

/**
 * Higher-order function to catch async errors in Express controllers/routes
 * Wrap your async controller functions with this to avoid try-catch in every handler
 *
 * Example:
 * export const createWarehouse = catchAsync(async (req, res) => { ... });
 *
 * @param {Function} fn - The async controller function
 * @returns {Function} - Express middleware that catches errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
