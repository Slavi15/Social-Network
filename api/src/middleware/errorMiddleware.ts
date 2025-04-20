import { Request, Response, NextFunction } from "express";
import { errorHandler } from "@/exceptions/ErrorHandler.ts";

const serverErrorMiddleware = (
    err: Error | any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    errorHandler.handleError(err, res);
};

export default serverErrorMiddleware;