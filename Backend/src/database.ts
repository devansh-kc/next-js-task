import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get the database URL from the environment
let database_url: string = process.env.DB_URL!;

if (!database_url) {
  throw new Error("Database URL is not defined in .env");
}

// Function to connect to the database
export async function connectToDatabase() {
  try {
    await mongoose.connect(database_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
}
