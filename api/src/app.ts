import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import session from "express-session";
import { createServer } from "http";
import sessionConfig from "./config/session";
import env from "./lib/env";
import errorMiddleware from "@/middleware/errorMiddleware";
import { initializeServices } from "@/services";
import { createApiRouter } from "@/routes/apiRouter";

const app = express();
const httpServer = createServer(app);

const { chatController } = initializeServices(httpServer);
const apiRouter = createApiRouter(chatController);

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
}));

app.set("json spaces", 4);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Social Network Server API!" });
});

app.use("/api", apiRouter);
app.use(errorMiddleware);

export { app, httpServer };