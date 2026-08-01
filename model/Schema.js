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

const onlineConsultationSchema = mongoose.Schema(
  {
    fullName: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    petType: requiredTrimmedString,
    petName: optionalTrimmedString,
    petAge: optionalTrimmedString,
    consultationMode: {
      type: String,
      trim: true,
      enum: ["video", "phone"],
      default: "video",
    },
    preferredDoctor: optionalTrimmedString,
    preferredSlot: optionalTrimmedString,
    concern: requiredTrimmedString,
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "confirmed", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    adminNotes: optionalTrimmedString,
  },
  schemaOptions
);
onlineConsultationSchema.index({ status: 1, createdAt: -1 });

const inPersonConsultationSchema = mongoose.Schema(
  {
    fullName: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    petType: requiredTrimmedString,
    petName: optionalTrimmedString,
    petAge: optionalTrimmedString,
    city: requiredTrimmedString,
    address: requiredTrimmedString,
    preferredDate: optionalTrimmedString,
    preferredTime: optionalTrimmedString,
    concern: requiredTrimmedString,
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "scheduled", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    adminNotes: optionalTrimmedString,
  },
  schemaOptions
);
inPersonConsultationSchema.index({ status: 1, createdAt: -1 });

const houseCallSchema = mongoose.Schema(
  {
    fullName: requiredTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: requiredTrimmedString,
    petType: requiredTrimmedString,
    petName: optionalTrimmedString,
    petAge: optionalTrimmedString,
    city: requiredTrimmedString,
    address: requiredTrimmedString,
    preferredDate: optionalTrimmedString,
    preferredTime: optionalTrimmedString,
    urgency: {
      type: String,
      trim: true,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    concern: requiredTrimmedString,
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewed", "dispatched", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    adminNotes: optionalTrimmedString,
  },
  schemaOptions
);
houseCallSchema.index({ status: 1, urgency: -1, createdAt: -1 });

const reviewSchema = mongoose.Schema(
  {
    fullName: requiredTrimmedString,
    contactEmail: optionalEmailField,
    rating: { type: Number, min: 1, max: 5, required: true },
    title: requiredTrimmedString,
    message: requiredTrimmedString,
    status: {
      type: String,
      trim: true,
      enum: ["new", "approved", "rejected"],
      default: "new",
      index: true,
    },
    adminNotes: optionalTrimmedString,
  },
  schemaOptions
);
reviewSchema.index({ status: 1, createdAt: -1 });

const communityStorySchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
      enum: ["success", "remembrance", "community"],
      index: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["new", "draft", "published", "rejected", "archived"],
      default: "draft",
      index: true,
    },
    title: requiredTrimmedString,
    excerpt: optionalTrimmedString,
    story: requiredTrimmedString,
    authorName: optionalTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: optionalTrimmedString,
    petName: optionalTrimmedString,
    location: optionalTrimmedString,
    image: optionalTrimmedString,
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  schemaOptions
);
communityStorySchema.index({ category: 1, status: 1, createdAt: -1 });

const blogPostSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    category: optionalTrimmedString,
    title: requiredTrimmedString,
    excerpt: optionalTrimmedString,
    content: requiredTrimmedString,
    authorName: optionalTrimmedString,
    coverImageUrl: optionalTrimmedString,
    coverImageAlt: optionalTrimmedString,
    externalUrl: optionalTrimmedString,
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  schemaOptions
);
blogPostSchema.index({ status: 1, featured: -1, publishedAt: -1, createdAt: -1 });

const petInfoAnimalSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    summary: requiredTrimmedString,
    idealFor: requiredTrimmedString,
    commonNeeds: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  schemaOptions
);

const petInfoBreedSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    type: requiredTrimmedString,
    name: requiredTrimmedString,
    origin: optionalTrimmedString,
    size: optionalTrimmedString,
    lifespan: optionalTrimmedString,
    temperament: [
      {
        type: String,
        trim: true,
      },
    ],
    careLevel: optionalTrimmedString,
    exerciseNeeds: optionalTrimmedString,
    groomingNeeds: optionalTrimmedString,
    goodFor: optionalTrimmedString,
    highlights: optionalTrimmedString,
  },
  schemaOptions
);
petInfoBreedSchema.index({ type: 1, name: 1 });
petInfoBreedSchema.index({ type: 1, createdAt: -1 });

const rescueAlertSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["new", "reviewing", "dispatched", "resolved", "archived"],
      default: "new",
      index: true,
    },
    reporterName: requiredTrimmedString,
    contactPhone: requiredTrimmedString,
    contactEmail: optionalEmailField,
    animalType: requiredTrimmedString,
    location: requiredTrimmedString,
    landmark: optionalTrimmedString,
    urgency: {
      type: String,
      trim: true,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },
    description: requiredTrimmedString,
    photo: optionalTrimmedString,
    adminNotes: optionalTrimmedString,
  },
  schemaOptions
);
rescueAlertSchema.index({ status: 1, urgency: -1, createdAt: -1 });

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

const VetProviderSchema = mongoose.Schema(
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

const VetAuthorSchema = mongoose.Schema(
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

const TrainingProgramSchema = mongoose.Schema(
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

const GroomingProgramSchema = mongoose.Schema(
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

const BoardingProgramSchema = mongoose.Schema(
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

const SiteSettingsSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      default: "default",
    },
    brandName: optionalTrimmedString,
    contactEmail: optionalEmailField,
    contactPhone: optionalTrimmedString,
    whatsapp: optionalTrimmedString,
    address: optionalTrimmedString,
    city: optionalTrimmedString,
    mapUrl: optionalTrimmedString,
    mapEmbedUrl: optionalTrimmedString,
    facebookUrl: optionalTrimmedString,
    instagramUrl: optionalTrimmedString,
    youtubeUrl: optionalTrimmedString,
    donationBkashNumber: optionalTrimmedString,
    donationEmail: optionalEmailField,
    homeHeroBadge: optionalTrimmedString,
    homeHeroTitle: optionalTrimmedString,
    homeHeroSubtitle: optionalTrimmedString,
    homeHeroImageUrl: optionalTrimmedString,
    homeHeroImageAlt: optionalTrimmedString,
    homeAdoptedCount: optionalTrimmedString,
    homeAdoptedLabel: optionalTrimmedString,
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
export const OnlineConsultations = mongoose.model(
  "OnlineConsultation",
  onlineConsultationSchema
);
export const InPersonConsultations = mongoose.model(
  "InPersonConsultation",
  inPersonConsultationSchema
);
export const HouseCallRequests = mongoose.model("HouseCallRequest", houseCallSchema);
export const Reviews = mongoose.model("SiteReview", reviewSchema);
export const CommunityStories = mongoose.model("CommunityStory", communityStorySchema);
export const BlogPosts = mongoose.model("BlogPost", blogPostSchema);
export const PetInfoAnimals = mongoose.model("PetInfoAnimal", petInfoAnimalSchema);
export const PetInfoBreeds = mongoose.model("PetInfoBreed", petInfoBreedSchema);
export const RescueAlerts = mongoose.model("RescueAlert", rescueAlertSchema);
export const Orders = mongoose.model("Order", OrderSchema);
export const AdoptableAnimals = mongoose.model(
  "AdoptableAnimal",
  AdoptableAnimalSchema
);
export const ShopItems = mongoose.model("ShopItem", ShopItemSchema);
export const VetProviders = mongoose.model("VetProvider", VetProviderSchema);
export const VetAuthors = mongoose.model("VetAuthor", VetAuthorSchema);
export const TrainingPrograms = mongoose.model(
  "TrainingProgram",
  TrainingProgramSchema
);
export const GroomingPrograms = mongoose.model(
  "GroomingProgram",
  GroomingProgramSchema
);
export const BoardingPrograms = mongoose.model(
  "BoardingProgram",
  BoardingProgramSchema
);
export const AdminCredentials = mongoose.model(
  "AdminCredential",
  AdminCredentialSchema
);
export const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
