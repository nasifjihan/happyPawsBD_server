export const createValidationError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const isBlank = (value) =>
  typeof value !== "string" || value.trim().length === 0;

export const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

export const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

export const assertRequiredFields = (payload, requiredFields) => {
  const missingFields = requiredFields.filter((field) => {
    const value = payload[field];

    if (typeof value === "number") {
      return Number.isNaN(value);
    }

    return value === undefined || value === null || isBlank(String(value));
  });

  if (missingFields.length > 0) {
    throw createValidationError(
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }
};

export const assertValidEmail = (value, fieldName = "email") => {
  if (!value) {
    return;
  }

  const normalizedValue = normalizeEmail(value);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
    throw createValidationError(`Invalid ${fieldName}.`);
  }
};

export const assertAllowedValues = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw createValidationError(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    );
  }
};
