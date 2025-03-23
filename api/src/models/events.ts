import { Schema, Types, Document, model } from "mongoose";

export interface IEvent extends Document {
    creators: Types.ObjectId[];
    title: string;
    description: string;
    date: Date;
    attendees: Types.ObjectId[];
}

const EventSchema = new Schema<IEvent>(
    {
        creators: {
            type: [{ type: Types.ObjectId, ref: "User" }],
            required: true,
            validate: {
                validator: (creators: Types.ObjectId[]) => creators.length > 0,
                message: "At least one creator is required!",
            },
        },
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
        date: {
            type: Date,
            required: true,
        },
        attendees: {
            type: [{ type: Types.ObjectId, ref: "User" }],
            default: [],
        },
    },
    { 
        timestamps: true 
    }
);

export const EventModel = model<IEvent>("Event", EventSchema);