export enum Privacy {
    PUBLIC = 0b001,
    FRIENDS = 0b010,
    PRIVATE = 0b100,
};

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
    comments: {
        _id: string;
        user_id: {
            _id: string;
            username: string;
            profile_picture: string;
        };
        content: string;
        createdAt: string;
    }[];
    privacy: Privacy;
    createdAt: string;
    updatedAt: string;
}