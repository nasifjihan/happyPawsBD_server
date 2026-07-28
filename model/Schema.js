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

const requiredEmailField = {
  type: String,
  required: true,
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
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "resolved", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
lostPetSchema.index({ status: 1, createdAt: -1 });

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
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "resolved", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
foundPetSchema.index({ status: 1, createdAt: -1 });

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
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "contacted", "approved", "rejected", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
adoptionSchema.index({ status: 1, createdAt: -1 });
adoptionSchema.index({ animalCode: 1, createdAt: -1 });

// Training Application Form Data Schema
const trainingSchema = mongoose.Schema(
  {
    name: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    programId: { type: Number, required: true, index: true },
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "contacted", "scheduled", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
trainingSchema.index({ status: 1, createdAt: -1 });
trainingSchema.index({ programId: 1, createdAt: -1 });

// Grooming Application Form Data Schema
const groomingSchema = mongoose.Schema(
  {
    name: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    programId: { type: Number, required: true, index: true },
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "contacted", "scheduled", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
groomingSchema.index({ status: 1, createdAt: -1 });
groomingSchema.index({ programId: 1, createdAt: -1 });

// Boarding Application Form Data Schema
const boardingSchema = mongoose.Schema(
  {
    name: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    address: requiredTrimmedString,
    programId: { type: Number, required: true, index: true },
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "contacted", "scheduled", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
boardingSchema.index({ status: 1, createdAt: -1 });
boardingSchema.index({ programId: 1, createdAt: -1 });

// Volunteer Application Form Data Schema
const volunteerApplicationSchema = mongoose.Schema(
  {
    fullName: requiredTrimmedString,
    contactEmail: requiredEmailField,
    contactPhone: requiredTrimmedString,
    city: requiredTrimmedString,
    preferredRole: requiredTrimmedString,
    availability: requiredTrimmedString,
    timeCommitment: optionalTrimmedString,
    preferredContactMethod: optionalTrimmedString,
    preferredContactTime: optionalTrimmedString,
    experience: optionalTrimmedString,
    motivation: requiredTrimmedString,
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  schemaOptions
);
volunteerApplicationSchema.index({ status: 1, createdAt: -1 });

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
    publicToken: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
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
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });

const contentSchemaOptions = {
  ...schemaOptions,
  strict: false,
};

const AdoptableAnimalSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
  },
  contentSchemaOptions
);

const ShopItemSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
  },
  contentSchemaOptions
);

const AdminCredentialSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
export const VolunteerApplication = mongoose.model(
  "VolunteerApplication",
  volunteerApplicationSchema
);
export const Orders = mongoose.model("Order", OrderSchema);
export const AdoptableAnimals = mongoose.model(
  "AdoptableAnimal",
  AdoptableAnimalSchema
);
export const ShopItems = mongoose.model("ShopItem", ShopItemSchema);
export const AdminCredentials = mongoose.model(
  "AdminCredential",
  AdminCredentialSchema
);
