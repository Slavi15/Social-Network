import { Schema, Types, Document, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    profile_picture: string;
    friends: Types.ObjectId[];
    is_active: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

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
        password: {
            type: String,
            required: [true, "You must enter a password!"],
            minlength: [8, "Password must be at least 8 characters long!"],
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
        timestamps: true,
    }
);

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<IUser>("User", UserSchema);