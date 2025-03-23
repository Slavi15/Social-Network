import { Request } from "express";
import { AuthRequest } from "./index";

interface RegisterUserRequest extends Request {
    body: {
        username: string;
        email: string;
        password: string;
    };
}

interface RegisterRequest extends RegisterUserRequest, AuthRequest {
    body: RegisterUserRequest["body"];
}

export { RegisterUserRequest, RegisterRequest };