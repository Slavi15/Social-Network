import mongoose, { Connection } from "mongoose";
import env from "@/lib/env";
import { AppError, HttpCode } from "@/exceptions/AppError";

let cachedConnection: Connection | null = null;

export const connectToDB = async () => {
    if (cachedConnection) {
        console.log("Connection already exists!");
        return cachedConnection;
    };

    try {
        const cnx = await mongoose.connect(env.MONGO_URI);
        cachedConnection = cnx.connection;
        console.log("Successfully established MongoDB connection!");
        return cachedConnection;
    } catch (err) {
        throw new AppError({
            httpCode: HttpCode.INTERNAL_SERVER_ERROR,
            description: "Unsuccessful MongoDB connection!"
        });
    };
};