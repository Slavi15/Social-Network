import { Schema, Types, Document, model } from "mongoose";

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
    },
    {
        timestamps: true
    }
);

export const EventModel = model<IEvent>("Event", EventSchema);