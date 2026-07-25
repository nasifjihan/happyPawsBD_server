const createValidationError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isBlank = (value) =>
  typeof value !== "string" || value.trim().length === 0;

const assertRequiredFields = (payload, requiredFields) => {
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

export const validateLostPetPayload = (payload) => {
  assertRequiredFields(payload, [
    "petName",
    "animalType",
    "colors",
    "ownerName",
    "contactPhone",
    "lastSeenLocation",
    "lostDate",
    "description",
    "petPicture",
  ]);

  return payload;
};

export const validateFoundPetPayload = (payload) => {
  assertRequiredFields(payload, [
    "animalType",
    "colors",
    "gender",
    "founderName",
    "contactPhone",
    "foundLocation",
    "foundDate",
    "description",
    "petPicture",
  ]);

  return payload;
};

export const validateAdoptionPayload = (payload, animalCode) => {
  assertRequiredFields(payload, [
    "animalType",
    "adopterName",
    "contactPhone",
    "address",
  ]);

  if (isBlank(animalCode)) {
    throw createValidationError("Animal code is required.");
  }

  return {
    ...payload,
    animalCode,
  };
};

export const validateProgramEnrollmentPayload = (payload, programId) => {
  assertRequiredFields(payload, ["name", "contactPhone", "address"]);

  const normalizedProgramId = Number(programId);

  if (Number.isNaN(normalizedProgramId)) {
    throw createValidationError("Program id must be a valid number.");
  }

  return {
    ...payload,
    programId: normalizedProgramId,
  };
};

export const validateOrderPayload = (payload) => {
  const { deliveryInfo, orderSummary, paymentMethod } = payload;

  if (!deliveryInfo || !orderSummary) {
    throw createValidationError(
      "Delivery information and order summary are required."
    );
  }

  assertRequiredFields(deliveryInfo, ["name", "phone", "email", "address"]);

  if (!Array.isArray(orderSummary.items) || orderSummary.items.length === 0) {
    throw createValidationError("Order items are required.");
  }

  if (Number.isNaN(Number(orderSummary.total))) {
    throw createValidationError("Order total must be a valid number.");
  }

  if (isBlank(paymentMethod || "")) {
    throw createValidationError("Payment method is required.");
  }

  return payload;
};

export const validatePaymentPayload = (payload) => {
  const { items } = payload;

  if (!Array.isArray(items) || items.length === 0) {
    throw createValidationError("At least one payment item is required.");
  }

  items.forEach((item) => {
    if (Number.isNaN(Number(item.price)) || Number(item.price) <= 0) {
      throw createValidationError(
        `Invalid price for item: ${item.id || item.name || "unknown"}`
      );
    }

    if (Number.isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
      throw createValidationError(
        `Invalid quantity for item: ${item.id || item.name || "unknown"}`
      );
    }
  });

  return payload;
};
