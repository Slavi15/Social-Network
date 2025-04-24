export interface IUser {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    friends: IUser[];
    is_active: boolean;
}

export interface IMessage {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
}
