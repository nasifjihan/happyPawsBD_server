import { createCheckoutSession, createOrderRecord } from "../services/order.service.js";
import {
  createAdoptionRecord,
  createFoundPetPost,
  createLostPetPost,
  createProgramEnrollment,
  listFoundPets,
  listLostPets,
} from "../services/pet.service.js";
import {
  validateAdoptionPayload,
  validateFoundPetPayload,
  validateLostPetPayload,
  validateOrderPayload,
  validatePaymentPayload,
  validateProgramEnrollmentPayload,
} from "../validation/requestValidators.js";
import { resolveClientOrigin } from "../utils/origin.js";

const sendErrorResponse = (response, error, fallbackStatus = 500) => {
  response.status(error.statusCode || fallbackStatus).json({
    message: error.message || "Something went wrong.",
  });
};

// Post lostPet in database
export const addLostPet = async (request, response) => {
  try {
    const lostPetData = validateLostPetPayload({
      ...request.body,
      petPicture: request.file?.path,
    });
    const savedLostPet = await createLostPetPost(lostPetData);
    response.status(201).json(savedLostPet);
  } catch (error) {
    console.error("Error in addLostPet:", error);
    sendErrorResponse(response, error, 409);
  }
};

// Get all lostPets
export const getLostPets = async (request, response) => {
  try {
    const lostPets = await listLostPets();
    response.status(200).json(lostPets);
  } catch (error) {
    sendErrorResponse(response, error, 500);
  }
};

// Post foundPet in database
export const addFoundPet = async (request, response) => {
  try {
    const foundPetData = validateFoundPetPayload({
      ...request.body,
      petPicture: request.file?.path,
    });
    const savedFoundPet = await createFoundPetPost(foundPetData);
    response.status(201).json(savedFoundPet);
  } catch (error) {
    console.error("Error in addFoundPet:", error);
    sendErrorResponse(response, error, 409);
  }
};

// Get all foundPets
export const getFoundPets = async (request, response) => {
  try {
    const foundPets = await listFoundPets();
    response.status(200).json(foundPets);
  } catch (error) {
    sendErrorResponse(response, error, 500);
  }
};

// Post Adoption Application in database
export const addAdoptionApplication = async (request, response) => {
  try {
    const adoptionApplication = validateAdoptionPayload(
      request.body,
      request.params.code
    );
    const savedApplication = await createAdoptionRecord(adoptionApplication);
    response.status(201).json(savedApplication);
  } catch (error) {
    console.error("Error:", error);
    sendErrorResponse(response, error, 409);
  }
};

// Post Training Enrollment in database
export const addTrainingEnrollment = async (request, response) => {
  try {
    const trainingEnrollment = validateProgramEnrollmentPayload(
      request.body,
      request.params.id
    );
    const savedEnrollment = await createProgramEnrollment(
      "training",
      trainingEnrollment
    );
    response.status(201).json(savedEnrollment);
  } catch (error) {
    console.error("Error:", error);
    sendErrorResponse(response, error, 409);
  }
};

// Post Grooming Enrollment in database
export const addGroomingEnrollment = async (request, response) => {
  try {
    const groomingEnrollment = validateProgramEnrollmentPayload(
      request.body,
      request.params.id
    );
    const savedEnrollment = await createProgramEnrollment(
      "grooming",
      groomingEnrollment
    );
    response.status(201).json(savedEnrollment);
  } catch (error) {
    console.error("Error:", error);
    sendErrorResponse(response, error, 409);
  }
};

// Post Boarding Enrollment in database
export const addBoardingEnrollment = async (request, response) => {
  try {
    const boardingEnrollment = validateProgramEnrollmentPayload(
      request.body,
      request.params.id
    );
    const savedEnrollment = await createProgramEnrollment(
      "boarding",
      boardingEnrollment
    );
    response.status(201).json(savedEnrollment);
  } catch (error) {
    console.error("Error:", error);
    sendErrorResponse(response, error, 409);
  }
};

// Shop Order
export const createOrder = async (req, res) => {
  try {
    const orderPayload = validateOrderPayload(req.body);
    const savedOrder = await createOrderRecord(orderPayload);
    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    sendErrorResponse(res, error, 500);
  }
};

// Stripe Payment Gateway Sandbox Intregation
export const createPayment = async (req, res) => {
  const clientUrl = resolveClientOrigin(req.headers.origin);

  try {
    const paymentPayload = validatePaymentPayload(req.body);
    const session = await createCheckoutSession({
      items: paymentPayload.items,
      clientUrl,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    sendErrorResponse(res, error, 500);
  }
};
