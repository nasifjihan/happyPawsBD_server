import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectMongo = async () =>
  mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

const isSrvDnsFailure = (error) =>
  error?.code === "ECONNREFUSED" && error?.syscall === "querySrv";

const Connection = async () => {
  try {
    if (env.dnsServers.length) {
      dns.setServers(env.dnsServers);
    }

    await connectMongo();
    console.log("Database connected successfully");
  } catch (error) {
    if (isSrvDnsFailure(error) && !env.dnsServers.length) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      await connectMongo();
      console.log("Database connected successfully");
      return;
    }

    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default Connection;
