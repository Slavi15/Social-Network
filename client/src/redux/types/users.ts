export interface IUser {
    _id: string;
    username: string;
    email: string;
    profile_picture?: string;
    friends: IUser[];
    chats: string[];
    is_active: boolean;
}

export interface IConnection {
    userId: string;
    username: string;
    profile_picture?: string;
    mutualCount: number;
}