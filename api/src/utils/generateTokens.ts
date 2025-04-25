import { Response } from "express";
import jwt from "jsonwebtoken";
import env from "@/lib/env";

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ _id: userId }, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ _id: userId }, env.JWT_REFRESH_SECRET, {
        expiresIn: "7m",
    });
};

export const setRefreshToken = (res: Response, userId: string): void => {
    const refreshToken = generateRefreshToken(userId);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax" as const
    });
};

export const verifyAccessToken = (token: string): jwt.JwtPayload | null => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    } catch (err) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload | null => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
    } catch (err) {
        return null;
    }
};