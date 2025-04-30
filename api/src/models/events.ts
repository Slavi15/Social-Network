import { Schema, Types, Document, model } from "mongoose";
import { IComment, IPost, Privacy } from "./posts";

export interface MediaProps {
    url: string;
    delete_url: string;
    filename: string;
}

export interface IEvent extends Document {
    title: string;
    description: string;
    banner: MediaProps;
    date: Date;
    creators: Types.ObjectId[];
    attendees: Types.ObjectId[];
    posts: Types.DocumentArray<IPost>;
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

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        banner: {
            type: MediaSchema,
            default: null,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        creators: {
            type: [Types.ObjectId],
            required: true,
            validate: {
                validator: (creators: Types.ObjectId[]) => creators.length > 0,
                message: "At least one creator is required!",
            },
        },
        attendees: {
            type: [Types.ObjectId],
            default: [],
        },
        posts: {
            type: [PostSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

export const EventModel = model<IEvent>("Event", EventSchema);