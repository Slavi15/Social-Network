import { Types } from "mongoose";

export interface IMessage extends Document {
    // _id: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    timestamp: Date;
    seen: Types.ObjectId[];
}

export interface IChat extends Document {
    // _id: Types.ObjectId;
    participants: Types.ObjectId[];
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: IMessage;
}

export interface ISendMessageData {
    chatId: string;
    senderId: string;
    content: string;
    tempId?: string;
}