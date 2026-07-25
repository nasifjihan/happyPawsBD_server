import mongoose from "mongoose";

const schemaOptions = {
  timestamps: true,
};

const requiredTrimmedString = {
  type: String,
  required: true,
  trim: true,
};

const optionalTrimmedString = {
  type: String,
  trim: true,
};

const optionalEmailField = {
  type: String,
  trim: true,
  lowercase: true,
};

// lostPet Form Data Schema
const lostPetSchema = mongoose.Schema(
  {
    petName: requiredTrimmedString,
    animalType: requiredTrimmedString,
    colors: requiredTrimmedString,
    ownerName: requiredTrimmedString,
    contactPhone: requiredTrimmedString,
    contactEmail: optionalEmailField,
    lastSeenLocation: requiredTrimmedString,
    lostDate: requiredTrimmedString,
    description: requiredTrimmedString,
    petPicture: requiredTrimmedString,
  },
  schemaOptions
);

// foundPet Form Data Schema
const foundPetSchema = mongoose.Schema(
  {
    animalType: requiredTrimmedString,
    breed: optionalTrimmedString,
    colors: requiredTrimmedString,
    gender: requiredTrimmedString,
    founderName: requiredTrimmedString,
    contactPhone: requiredTrimmedString,
    contactEmail: optionalEmailField,
    foundLocation: requiredTrimmedString,
    foundDate: requiredTrimmedString,
    description: requiredTrimmedString,
    petPicture: requiredTrimmedString,
  },
  schemaOptions
);

// Adoption Application Form Data Schema
const adoptionSchema = mongoose.Schema(
  {
    animalCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    animalType: requiredTrimmedString,
    adopterName: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    experience: optionalTrimmedString,
  },
  schemaOptions
);

// Training Application Form Data Schema
const trainingSchema = mongoose.Schema(
  {
    name: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    programId: { type: Number, required: true, index: true },
  },
  schemaOptions
);

// Grooming Application Form Data Schema
const groomingSchema = mongoose.Schema(
  {
    name: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    programId: { type: Number, required: true, index: true },
  },
  schemaOptions
);

// Boarding Application Form Data Schema
const boardingSchema = mongoose.Schema(
  {
    name: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    programId: { type: Number, required: true, index: true },
  },
  schemaOptions
);

const OrderSchema = mongoose.Schema(
  {
    deliveryInfo: {
      name: requiredTrimmedString,
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: requiredTrimmedString,
      city: optionalTrimmedString,
      state: optionalTrimmedString,
      zip: optionalTrimmedString,
      address: requiredTrimmedString,
    },
    orderSummary: {
      items: [
        {
          id: optionalTrimmedString,
          name: optionalTrimmedString,
          price: { type: Number, min: 0 },
          quantity: { type: Number, min: 1 },
        },
      ],
      total: { type: Number, min: 0 },
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      enum: ["online_payment", "cash_on_delivery"],
    },
    orderStatus: {
      type: String,
      trim: true,
      enum: [
        "created",
        "pending_payment",
        "checkout_started",
        "payment_setup_failed",
        "payment_failed",
        "paid",
        "cancelled",
      ],
      default: "created",
      index: true,
    },
    paymentStatus: {
      type: String,
      trim: true,
      enum: ["unpaid", "paid", "failed", "cancelled"],
      default: "unpaid",
    },
    stripeCheckoutSessionId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
  },
  schemaOptions
);

// Schema to model
export const PostLostPet = mongoose.model("lostPet", lostPetSchema);
export const PostFoundPet = mongoose.model("foundPet", foundPetSchema);
export const AdoptionApplication = mongoose.model("adoption", adoptionSchema);
export const TrainingEnrollment = mongoose.model(
  "TrainingEnrollment",
  trainingSchema
);
export const GroomingEnrollment = mongoose.model(
  "GroomingEnrollment",
  groomingSchema
);
export const BoardingEnrollment = mongoose.model(
  "BoardingEnrollment",
  boardingSchema
);
export const Orders = mongoose.model("Order", OrderSchema);
