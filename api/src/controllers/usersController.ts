import { Request, Response } from "express";
import { Types } from "mongoose";
import { IUser, UserModel } from "@/models/users.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class UserController {

    private validateUser = (data: Partial<IUser>): string | null => {
        if (!data.username || data.username.length < 3 || data.username.length > 50) {
            return "Username must be between 3-50 characters!";
        };

        if (!data.email || !/^[A-Za-z0-9]+@fmi.uni-sofia.bg$/.test(data.email)) {
            return "Invalid email format!";
        };

        return null;
    };

    public getUsers = async (req: Request, res: Response) => {
        const users = await UserModel.find().populate("friends", "username email");

        if (!users) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Could not fetch users!"
            });
        };

        res.status(200).json(users);
    };

    public getUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            });
        };

        const user = await UserModel.findById(id).populate("friends", "username email");

        if (!user) {
            throw new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: "User not found!"
            });
        };

        res.status(200).json(user);
    };

    public createUser = async (req: Request, res: Response) => {
        const err = this.validateUser(req.body);

        if (err) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user provided!",
            });
        };

        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    };

    public updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            });
        };

        const err = this.validateUser(req.body);

        if (err) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user provided!",
            });
        };

        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            throw new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: "User not found!",
            });
        };

        res.status(200).json(updatedUser);
    };

    public deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            });
        };

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            throw new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: "User not found!",
            });
        };

        res.status(200).json({
            message: "User deleted successfully!"
        });
    };
};

export const usersController = new UserController();