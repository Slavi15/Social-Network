import { NextFunction, Request, Response } from "express";
import { LoginRequest, LoginResponse } from "@/types/auth/login";
import { IUser, UserModel } from "@/models/users";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { generateAccessToken, setRefreshToken } from "@/utils/generateTokens";
import { RegisterRequest } from "@/types/auth/register";
import env from "@/lib/env";

class AuthController {
    
    public login = async (req: LoginRequest, res: LoginResponse, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const user: IUser = await UserModel.findOne({ email }).select("+password");

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found",
                }));
            }

            const isMatch: boolean = await user.comparePassword(password);

            if (!isMatch) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Internal server error",
                }));
            }

            const accessToken = generateAccessToken(user._id.toString());
            await setRefreshToken(res, user._id.toString());

            res.status(200).json({
                accessToken,
                user,
                message: "Successfully logged in",
            });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Internal server error",
            }));
        }
    };

    public register = async (req: RegisterRequest, res: Response, next: NextFunction) => {
        try {
            const { username, email, password } = req.body;

            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Internal server error",
                }));
            }

            const newUser = await UserModel.create(req.body);

            const accessToken = generateAccessToken(newUser._id.toString());
            await setRefreshToken(res, newUser._id.toString());

            res.status(201).json({
                accessToken,
                user: newUser,
                message: "Successfully registered",
            });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Internal server error",
            }));
        }
    };

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
            });

            res.status(200).json({
                message: "Successfully logged out",
            });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Internal server error",
            }));
        }
    };

}

export const authController = new AuthController();