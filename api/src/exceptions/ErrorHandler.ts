import { Response } from "express";
import { AppError, HttpCode } from "./AppError.ts";

class ErrorHandler {

    public handleError(err: Error | AppError, res?: Response): void {
        return this.isTrustedError(err) && res ?
            this.handleTrustedError(err as AppError, res) :
            this.handleCriticalError(err, res);
    }

    private isTrustedError(err: Error | any): boolean {
        return (err instanceof AppError) ? err.isOperational : false;
    }

    private handleTrustedError(err: AppError, response: Response): void {
        response.status(err.httpCode)
            .json({ message: err.message });
    }

    private handleCriticalError(err: Error | AppError, response?: Response): void {
        if (response) {
            response.status(HttpCode.INTERNAL_SERVER_ERROR)
                .json({ message: 'Internal server err' });
        }

        process.exit(1);
    }
}

export const errorHandler = new ErrorHandler();