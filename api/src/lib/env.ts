import { z } from "zod";

const envSchema = z.object({
    ORIGIN: z.string().url(),
    PORT: z.coerce.number().min(3000).max(8000),
    NODE_ENV: z
        .union([ z.literal("development"), z.literal("production") ])
        .default("development"),
    MONGO_URI: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string()
});

const env = envSchema.parse(process.env);

export default env;