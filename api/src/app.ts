import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./lib/env.ts";
import apiRouter from "@/routes/apiRouter.ts";

import errorMiddleware from "@/middleware/errorMiddleware.ts";

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(cors({
    origin: env.ORIGIN,
}));

app.use(express.json());
app.set("json spaces", 4);

app.use(express.urlencoded({ 
    extended: true 
}));

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