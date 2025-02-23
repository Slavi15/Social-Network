import mongoose from "mongoose";
import env from "@/lib/env.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

export const connectToDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("Successfully established MongoDB connection!");
    } catch (err) {
        throw new AppError({
            httpCode: HttpCode.INTERNAL_SERVER_ERROR,
            description: "Unsuccessful MongoDB connection!"
        });
    };
};