export interface IUser {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    friends: string[];
    is_active: boolean;
}

export interface IMessage {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
}

export interface IFriendRequest {
    id: string;
    sender: string;
    receiver: string;
    status: FriendRequestStatus;
    createdAt: Date;
}

export enum FriendRequestStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}