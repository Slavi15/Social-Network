import { IUser } from "./users";

export interface IMessage {
    _id: string;
    sender: IUser;
    content: string;
    timestamp: Date;
    seen: string[];
}

export interface IChat {
    _id: string;
    participants: string[];
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
