import { Request, Response, NextFunction } from "express";
import { EventModel } from "@/models/events.ts";
import { validateEvent } from "@/validators/eventsValidator";
import { UserModel } from "@/models/users.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class EventController {

    public createEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { creators, title, description, date } = req.body;

            const validationError = validateEvent(req.body);

            if (validationError) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: validationError,
                }));
            }

            const newEvent = await EventModel.create({ creators, title, description, date });
            res.status(201).json(newEvent);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating event!",
            }));
        }
    };

    public updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_id } = req.params;

            const validationError = validateEvent(req.body);
            if (validationError) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: validationError,
                }));
            }

            const updatedEvent = await EventModel.findByIdAndUpdate(event_id, req.body, { new: true });

            if (!updatedEvent) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            res.status(200).json(updatedEvent);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error updating event!",
            }));
        }
    };

    public addCreator = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_id } = req.params;
            const { creator_id } = req.body;

            const event = await EventModel.findById(event_id);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const user = await UserModel.findById(creator_id);

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                }));
            }

            if (event.creators.includes(creator_id)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is already a creator of this event!",
                }));
            }

            event.creators.push(creator_id);
            await event.save();

            res.status(200).json(event);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error adding creator!",
            }));
        }
    };

    public removeCreator = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_id } = req.params;
            const { creator_id } = req.body;

            const event = await EventModel.findById(event_id);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            if (!event.creators.includes(creator_id)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is not a creator of this event!",
                }));
            }

            event.creators = event.creators.filter((id) => id.toString() !== creator_id);
            await event.save();

            res.status(200).json(event);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error removing creator!",
            }));
        }
    };

    public joinEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_id } = req.params;
            const { user_id } = req.body;

            const event = await EventModel.findById(event_id);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const user = await UserModel.findById(user_id);

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                }));
            }

            if (event.attendees.includes(user_id)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is already attending this event!",
                }));
            }

            event.attendees.push(user_id);
            await event.save();

            res.status(200).json(event);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error joining event!",
            }));
        }
    };

    public leaveEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_id } = req.params;
            const { user_id } = req.body;

            const event = await EventModel.findById(event_id);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            if (!event.attendees.includes(user_id)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is not attending this event!",
                }));
            }

            event.attendees = event.attendees.filter((id) => id.toString() !== user_id);
            await event.save();

            res.status(200).json(event);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error leaving event!",
            }));
        }
    };

}

export const eventController = new EventController();