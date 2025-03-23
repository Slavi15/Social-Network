import { Schema, Types, Document, model } from "mongoose";

export interface IMessage extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    content: string;
}

const MessageSchema = new Schema<IMessage>(
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
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { 
        timestamps: true 
    }
);

export const MessageModel = model<IMessage>("Message", MessageSchema);