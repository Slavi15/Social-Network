import { Schema, Types, Document, model } from "mongoose";

export enum Privacy {
    PUBLIC = 0b001,
    FRIENDS = 0b010,
    PRIVATE = 0b100,
};

export interface IComment extends Types.Subdocument {
    user_id: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaProps {
    url: string;
    delete_url: string;
    filename: string;
}

export interface IPost extends Document {
    user_id: Types.ObjectId;
    content: string;
    media: MediaProps | null;
    likes: Types.ObjectId[];
    comments: Types.DocumentArray<IComment>;
    privacy: Privacy;
    createdAt?: Date;
    updatedAt?: Date;
}

const MediaSchema = new Schema<MediaProps>(
    {
        url: {
            type: String,
            required: true,
            validate: {
                validator: (s: string) => /^https?:\/\/.+\..+$/.test(s),
                message: "Invalid media URL provided!"
            }
        },
        delete_url: {
            type: String,
            required: true,
            validate: {
                validator: (s: string) => /^https?:\/\/.+\..+$/.test(s),
                message: "Invalid delete URL provided!"
            }
        },
        filename: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);

const CommentSchema = new Schema<IComment>(
    {
        user_id: {
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

const PostSchema = new Schema<IPost>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: [true, "The post should have content!"],
            maxlength: [200, "Post content should not exceed 200 symbols!"],
            trim: true,
        },
        media: {
            type: MediaSchema,
            default: null,
            required: false
        },
        likes: [{
            type: Types.ObjectId,
            ref: "User",
            default: [],
        }],
        comments: [CommentSchema],
        privacy: {
            type: Number,
            enum: [Privacy.PUBLIC, Privacy.FRIENDS, Privacy.PRIVATE],
            required: true,
            default: Privacy.FRIENDS,
        },
    },
    {
        timestamps: true
    }
);

export const PostModel = model<IPost>("Post", PostSchema);