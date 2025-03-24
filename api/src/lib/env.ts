import { z } from "zod";

const envSchema = z.object({
    ORIGIN: z.string().url(),
    PORT: z.coerce.number().min(3000).max(8000).default(7000),
    WS_PORT: z.coerce.number().min(3000).max(8000).default(7001),
    NODE_ENV: z
        .union([ z.literal("development"), z.literal("production") ])
        .default("development"),
    MONGO_URI: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().min(1).max(65535).default(6379),
    REDIS_PASSWORD: z.string().min(8),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
});

type Env = z.infer<typeof envSchema>;
const env: Env = envSchema.parse(process.env);

export default env;