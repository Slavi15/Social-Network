import { Request, Response, NextFunction } from "express";
import { EventModel } from "@/models/events.ts";
import { validateEvent } from "@/validators/eventsValidator";
import { UserModel } from "@/models/users.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class EventController {

    public getEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await EventModel.find()
                .populate('title creators attendees');

            res.status(HttpCode.OK).json(events);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching events!",
            }));
        }
    };

    public getEventById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const event = await EventModel.findById(eventId)
                .populate('title creators attendees');

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            res.status(HttpCode.OK).json(event);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching event!",
            }));
        }
    };

    public getEventByTitle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title } = req.params;
            const events = await EventModel.find({
                title: title
            }).populate('title creators attendees');

            res.status(HttpCode.OK).json(events);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error searching events by title!",
            }));
        }
    };

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
            res.status(HttpCode.CREATED).json(newEvent);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating event!",
            }));
        }
    };

    public updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;

            const validationError = validateEvent(req.body);
            if (validationError) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: validationError,
                }));
            }

            const updatedEvent = await EventModel.findByIdAndUpdate(eventId, req.body, { new: true });

            if (!updatedEvent) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            res.status(HttpCode.OK).json(updatedEvent);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error updating event!",
            }));
        }
    };

    public deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const deletedEvent = await EventModel.findByIdAndDelete(eventId);

            if (!deletedEvent) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            res.status(HttpCode.OK).json({ message: "Event deleted successfully" });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error deleting event!",
            }));
        }
    };

    public addCreator = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const { creator_id } = req.body;

            const event = await EventModel.findById(eventId);

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

            res.status(HttpCode.OK).json(event);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error adding creator!",
            }));
        }
    };

    public removeCreator = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const { creator_id } = req.body;

            const event = await EventModel.findById(eventId);

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

            res.status(HttpCode.OK).json(event);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error removing creator!",
            }));
        }
    };

    public joinEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const { user_id } = req.body;

            const event = await EventModel.findById(eventId);

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

            res.status(HttpCode.OK).json(event);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error joining event!",
            }));
        }
    };

    public leaveEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const { user_id } = req.body;

            const event = await EventModel.findById(eventId);

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

            res.status(HttpCode.OK).json(event);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error leaving event!",
            }));
        }
    };

}

export const eventController = new EventController();