import { Schema, Types, model } from "mongoose";
import { IChat, IMessage } from "../types/chats";

const MessageSchema = new Schema<IMessage>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        seen: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    {
        timestamps: true
    }
);

const ChatSchema = new Schema<IChat>(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            validate: {
                validator: (v: Types.ObjectId[]) => v.length >= 2,
                message: "Chat must have at least 2 participants"
            }
        }],
        messages: [MessageSchema],
        lastMessage: MessageSchema
    },
    {
        timestamps: true
    }
);

ChatSchema.pre("save", async function (next) {
    if (this.messages.length > 0) {
        this.lastMessage = this.messages[this.messages.length - 1];
    }
    next();
});

export const MessageModel = model<IMessage>("Message", MessageSchema);
export const ChatModel = model<IChat>("Chat", ChatSchema);
