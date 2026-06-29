import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        if (!dbURI) {
            throw new Error("MONGO_URL is not defined in the .env file.");
        }

        await mongoose.connect(dbURI);

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
    }
};

export default connectDB;