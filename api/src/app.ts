import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import env from "./lib/env.ts";
import apiRouter from "@/routes/apiRouter.ts";

import errorMiddleware from "@/middleware/errorMiddleware.ts";
import session from "express-session";
import sessionConfig from "./config/session.ts";

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(cors({
    origin: env.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(session(sessionConfig));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(fileUpload({
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    abortOnLimit: true,
}));

app.set("json spaces", 4);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Social Network Server API!"
    });
});

// Router
app.use("/api", apiRouter);

// Error middlewares
app.use(errorMiddleware);

export default app;