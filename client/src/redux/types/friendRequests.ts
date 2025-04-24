export interface IFriendRequest {
    _id: string;
    sender: string;
    receiver: string;
    status: FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum FriendRequestStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

export interface SendFriendRequestPayload {
    sender: string;
    receiver: string;
}

export interface ProcessFriendRequestPayload {
    requestId: string;
}

export interface UnfriendPayload {
    userId: string;
    friendId: string;
}
