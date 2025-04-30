export enum Privacy {
    PUBLIC = 0b001,
    FRIENDS = 0b010,
    PRIVATE = 0b100,
};

export interface MediaProps {
    url: string;
    delete_url: string;
    filename: string;
}

export interface CommentUser {
    _id: string;
    username: string;
    profile_picture?: string;
}

export interface IComment {
    _id: string;
    user_id: CommentUser;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum PostType {
    USER = "user",
    EVENT = "event"
}

export interface IPost {
    _id: string;
    user_id: {
        _id: string;
        username: string;
        profile_picture: string;
    };
    content: string;
    media: {
        url: string;
        delete_url: string;
        filename: string;
    };
    likes: string[];
    comments: IComment[];
    privacy: Privacy;
    createdAt: string;
    updatedAt: string;
}