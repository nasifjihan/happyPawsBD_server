import nodemailer from "nodemailer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

// Get __dirname equivalent for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

const ensureMailerConfig = () => {
  if (!process.env.EMAIL_USER || !fromEmail || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email configuration is incomplete. Set EMAIL_USER, EMAIL_PASS, and optionally EMAIL_FROM."
    );
  }
};

const sendTemplatedEmail = async ({
  to,
  subject,
  templateFile,
  templateData,
}) => {
  ensureMailerConfig();

  const templatePath = join(__dirname, "../helper", templateFile);
  const htmlContent = await ejs.renderFile(templatePath, templateData);

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html: htmlContent,
  });

  console.log("Email sent successfully to:", to);
};

export const trainingConfirmationEmail = async (
  userEmail,
  userName,
  address,
  programId
) => {
  await sendTemplatedEmail({
    to: userEmail,
    subject: "Training Program Confirmation",
    templateFile: "emailTemplate.ejs",
    templateData: {
      programName: "Training",
      userName,
      userEmail,
      address,
      programId,
    },
  });
};

export const groomingConfirmationEmail = async (
  userEmail,
  userName,
  address,
  programId
) => {
  await sendTemplatedEmail({
    to: userEmail,
    subject: "Grooming Program Confirmation",
    templateFile: "emailTemplate.ejs",
    templateData: {
      programName: "Grooming",
      userName,
      userEmail,
      address,
      programId,
    },
  });
};

export const boardingConfirmationEmail = async (
  userEmail,
  userName,
  address,
  programId
) => {
  await sendTemplatedEmail({
    to: userEmail,
    subject: "Boarding Program Confirmation",
    templateFile: "emailTemplate.ejs",
    templateData: {
      programName: "Boarding",
      userName,
      userEmail,
      address,
      programId,
    },
  });
};

export const sendAdoptionConfirmationEmail = async (
  userEmail,
  adopterName,
  contactEmail,
  contactPhone,
  address,
  experience,
  animalCode,
  animalType
) => {
  await sendTemplatedEmail({
    to: userEmail,
    subject: "Adoption Application Confirmation",
    templateFile: "adoptionTemplate.ejs",
    templateData: {
      adopterName,
      contactEmail,
      contactPhone,
      address,
      experience,
      animalCode,
      animalType,
    },
  });
};
