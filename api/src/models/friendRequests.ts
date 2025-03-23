import { Schema, Types, Document, model } from "mongoose";

export interface IFriendRequest extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
}

const FriendRequestSchema = new Schema<IFriendRequest>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { 
        timestamps: true 
    }
);

export const FriendRequestModel = model<IFriendRequest>("FriendRequest", FriendRequestSchema);