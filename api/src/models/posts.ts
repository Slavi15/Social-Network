import { Schema, Types, Document, model } from "mongoose";

export enum Privacy {
    PUBLIC  = 0b001,
    FRIENDS = 0b010,
    PRIVATE = 0b100,
};

export interface IComment {
    user_id: Types.ObjectId,
    content: string,
};

export interface IPost extends Document {
    user_id: Types.ObjectId,
    content: string,
    media_url: string,
    likes: Types.ObjectId[],
    comments: IComment[],
    privacy: Privacy,
};

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
        media_url: {
            type: String,
            validate: {
                validator: (s: string) => /^https?:\/\/.+\..+$/.test(s) || !s,
                message: "Invalid media URL provided!",
            },
            default: "",
            trim: true,
        },
        likes: [{ 
            type: Types.ObjectId, 
            ref: "User", 
            default: [],
        }],
        comments: [{
            user_id: { 
                type: Types.ObjectId, 
                ref: "User",
                required: true,
            },
            content: {
                type: String,
                required: true,
                trim: true,
            },
        }],
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