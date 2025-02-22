import mongoose, { Schema, Types, Document, model } from "mongoose";

export interface IUser extends Document {
    id: Types.ObjectId,
    username: string,
    email: string,
    profile_picture: string,
    friends: Types.ObjectId[],
    is_active: boolean,
};

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "You must enter username!"],
            minlength: [3, "Username must be at least 3 characters long!"],
            maxlength: [50, "Username cannot exceed 50 characters!"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "You must enter email!"],
            unique: true,
            match: [/^[A-Za-z0-9]+@fmi.uni-sofia.bg$/, "Invalid email format!"],
        },
        profile_picture: {
            type: String,
            required: false,
            validate: {
                validator: (s: string) => /^https?:\/\/.+\..+$/.test(s) || !s,
                message: "Invalid profile picture URL!",
            },
            default: "",
        },
        friends: {
            type: [{ type: Types.ObjectId, ref: "User" }],
            default: [],
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);