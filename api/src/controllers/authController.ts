import { CookieOptions, NextFunction, Request, Response } from "express";
import { LoginRequest, LoginResponse } from "@/types/auth/login";
import { IUser, UserModel } from "@/models/users";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { generateAccessToken, generateRefreshToken, setRefreshToken, verifyRefreshToken } from "@/utils/generateTokens";
import { minidenticon } from 'minidenticons';
import { RegisterRequest } from "@/types/auth/register";
import { redisService } from "@/services/tokens";
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

            res.status(HttpCode.OK)
                .json({
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

            const minidenticonIcon = minidenticon(`${username}:${email}`, 90, 50, (str: string) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return hash;
            });

            const newUser = await UserModel.create({
                ...req.body,
                profile_picture: minidenticonIcon
            });

            const accessToken = generateAccessToken(newUser._id.toString());
            await setRefreshToken(res, newUser._id.toString());

            res.status(HttpCode.CREATED).json({
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
        const { accessToken, refreshToken } = req.cookies;

        try {
            const destroySession = (): Promise<void> => {
                return new Promise((resolve, reject) => {
                    if (!req.session) return resolve();
                    req.session.destroy((err) => {
                        err ? reject(err) : resolve();
                    });
                });
            };

            await Promise.allSettled([
                accessToken ? redisService.addToBlacklist(accessToken) : Promise.resolve(),
                refreshToken ? redisService.addToBlacklist(refreshToken) : Promise.resolve(),
                destroySession(),
            ]);

            const cookieSettings: CookieOptions = {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
            };

            res.clearCookie('accessToken', cookieSettings);
            res.clearCookie('refreshToken', cookieSettings);
            res.clearCookie('connect.sid', cookieSettings);

            return res.status(HttpCode.OK).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: 'Logout failed',
            }));
        }
    };

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        const { accessToken, refreshToken } = req.cookies;

        if (!refreshToken) {
            return next(new AppError({
                httpCode: HttpCode.UNAUTHORIZED,
                description: "No refresh token provided",
            }));
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid refresh token",
                }));
            }

            const isBlacklisted = await redisService.isBlacklisted(refreshToken);
            if (isBlacklisted) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Refresh token revoked",
                }));
            }

            const user = await UserModel.findById(decoded.id).select("-password");
            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User not found",
                }));
            }

            const newAccessToken = generateAccessToken(user._id.toString());

            const newRefreshToken = generateRefreshToken(user._id.toString());
            setRefreshToken(res, user._id.toString());

            return res.status(HttpCode.OK).json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    friends: user.friends,
                    is_active: user.is_active
                },
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });

        } catch (error) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: env.NODE_ENV === "production" ? "none" : "lax",
            });

            return next(new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid refresh token",
            }));
        }
    };

}

export const authController = new AuthController();