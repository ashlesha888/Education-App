import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbURI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(dbURI);
        console.log("Database Connected");
    } catch (error) {
        console.log("Error during Connection to Database");
        process.exit(1);
    }
};
export default connectDB;