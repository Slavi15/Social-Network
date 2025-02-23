import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { UserModel } from "@/models/users.ts";
import { validateUser } from "@/validators/usersValidator.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class UserController {

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await UserModel.find().populate("friends", "username email");
            res.status(200).json(users);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Could not fetch users!"
            }));
        };
    };

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const user = await UserModel.findById(user_id).populate("friends", "username email");

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!"
                }));
            };

            res.status(200).json(user);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Invalid user ID!"
            }));
        };
    };

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const err = validateUser(req.body);

            if (err) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid user provided!",
                }));
            };

            const newUser = await UserModel.create(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user!"
            }));
        };
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const err = validateUser(req.body);

            if (err) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid user provided!",
                }));
            };

            const updatedUser = await UserModel.findByIdAndUpdate(user_id, req.body, { new: true });

            if (!updatedUser) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                }));
            };

            res.status(200).json(updatedUser);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            }));
        };
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const deletedUser = await UserModel.findByIdAndDelete(user_id);

            if (!deletedUser) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                });
            };

            res.status(200).json({ message: "User deleted successfully!" });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            }));
        };
    };
};

export const usersController = new UserController();