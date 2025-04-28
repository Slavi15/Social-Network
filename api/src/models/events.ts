import { Schema, Types, Document, model } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    creators: Types.ObjectId[];
    attendees: Types.ObjectId[];
}

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