import { Schema, Types, Document, model } from "mongoose";

export enum FriendRequestStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
}

export interface IFriendRequest extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: FriendRequestStatus;
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
            enum: Object.values(FriendRequestStatus),
            default: FriendRequestStatus.PENDING,
        },
    },
    { 
        timestamps: true 
    }
);

export const FriendRequestModel = model<IFriendRequest>("FriendRequest", FriendRequestSchema);