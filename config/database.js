import mongoose from "mongoose";

// Safe database connection utility
const connectDB = async () => {
    const dbURL = process.env.MONGO_URL;

    try {
        if (!dbURL) {
            throw new Error("MONGO_URL is not defined in the environment configurations.");
        }

        await mongoose.connect(dbURL);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:");
        console.error(error.message);
        
        // Only kill the app if it fails to connect on the very first startup attempt
        if (mongoose.connection.readyState !== 1) {
            process.exit(1); 
        }
    }
};

// Handle unexpected disconnections gracefully while the server is running
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected! Attempting to reconnect automatically...");
});

export default connectDB;
