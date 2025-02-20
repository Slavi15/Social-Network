export enum HttpCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
};

interface AppErrorArgs {
    name?: string;
    httpCode: HttpCode,
    description: string;
    isOperational?: boolean;
}

export class AppError extends Error {
    
    private readonly _name: string;
    private readonly _httpCode: HttpCode;
    private readonly _isOperational: boolean = true;

    constructor(args: AppErrorArgs) {
        super(args.description);

        this._name = args.name || "Error";
        this._httpCode = args.httpCode;

        if (args.isOperational !== undefined) {
            this._isOperational = args.isOperational;
        }

        Error.captureStackTrace(this, AppError);
    }

    public get name() {
        return this._name;
    }

    public get httpCode() {
        return this._httpCode;
    }

    public get isOperational() {
        return this._isOperational;
    }
}