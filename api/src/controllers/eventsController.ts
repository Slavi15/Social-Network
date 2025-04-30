import { Request, Response, NextFunction } from "express";
import { EventModel } from "@/models/events.ts";
import { validateEvent } from "@/validators/eventsValidator";
import { UserModel } from "@/models/users.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";
import { Privacy } from "@/models/posts";

class EventController {

    public getEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await EventModel.find()
                .populate('title banner creators attendees')
                .sort({ date: 1 });

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
                .populate('title banner creators attendees');

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
            }).populate('title banner creators attendees');

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
            const { title, description, creators, banner, date } = req.body;

            const validationError = validateEvent(req.body);

            if (validationError) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: validationError,
                }));
            }

            const newEvent = await EventModel.create({
                title,
                description,
                creators,
                banner,
                date: new Date(date)
            });
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
            const { creatorId } = req.body;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const user = await UserModel.findById(creatorId);

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                }));
            }

            if (event.creators.includes(creatorId)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is already a creator of this event!",
                }));
            }

            event.creators.push(creatorId);
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
            const { creatorId } = req.body;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            if (!event.creators.includes(creatorId)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is not a creator of this event!",
                }));
            }

            event.creators = event.creators.filter((id) => id.toString() !== creatorId);
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
            const { userId } = req.body;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const user = await UserModel.find({
                _id: userId
            });

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                }));
            }

            if (event.attendees.includes(userId)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is already attending this event!",
                }));
            }

            event.attendees.push(userId);
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
            const { userId } = req.body;

            const event = await EventModel.findById(eventId);

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            if (!event.attendees.includes(userId)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User is not attending this event!",
                }));
            }

            event.attendees = event.attendees.filter((id) => id.toString() !== userId);
            await event.save();

            res.status(HttpCode.OK).json(event);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error leaving event!",
            }));
        }
    };

    public getEventPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;

            const event = await EventModel.findById(eventId)
                .populate('posts.user_id', 'username profile_picture')
                .populate('posts.comments.user_id', 'username profile_picture');

            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            res.status(HttpCode.OK).json(event.posts);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching event posts!",
            }));
        }
    };

    public createEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const { content, user_id, media, privacy } = req.body;

            if (!content) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Post content is required!",
                }));
            }

            if (content.length > 200) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Post content should not exceed 200 symbols!",
                }));
            }

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

            if (!event.creators.includes(user_id._id)) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "Only creators can post in this event!",
                }));
            }

            const newPost = {
                user_id,
                content,
                media: media || null,
                likes: [],
                comments: [],
                privacy: privacy || Privacy.FRIENDS
            };

            event.posts.push(newPost);
            await event.save();

            const populatedEvent = await EventModel.populate(event, {
                path: 'posts.user_id',
                select: 'username profile_picture'
            });

            res.status(HttpCode.CREATED).json(populatedEvent.posts[populatedEvent.posts.length - 1]);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating event post!",
            }));
        }
    };

    public updateEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, postId } = req.params;
            const { content, media, user_id } = req.body;

            if (!content) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Post content is required!",
                }));
            }

            if (content.length > 200) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Post content should not exceed 200 symbols!",
                }));
            }

            const event = await EventModel.findById(eventId);
            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const postIndex = event.posts.findIndex(p => p._id.toString() === postId);
            if (postIndex === -1) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!",
                }));
            }

            if (event.posts[postIndex].user_id._id.toString() !== user_id._id) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "You can only update your own posts!",
                }));
            }

            event.posts[postIndex].content = content;
            if (media) event.posts[postIndex].media = media;
            await event.save();

            const populatedEvent = await EventModel.populate(event, {
                path: 'posts.user_id',
                select: 'username profile_picture'
            });

            res.status(HttpCode.OK).json(populatedEvent.posts[postIndex]);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error updating event post!",
            }));
        }
    };

    public deleteEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, postId } = req.params;
            const { userId } = req.body;

            const event = await EventModel.findById(eventId);
            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const postIndex = event.posts.findIndex(p => p._id.toString() === postId);
            if (postIndex === -1) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!",
                }));
            }

            if (event.posts[postIndex].user_id.toString() !== userId) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "You can only delete your own posts unless you're an admin!",
                }));
            }

            event.posts.splice(postIndex, 1);
            await event.save();

            res.status(HttpCode.OK).json({ message: "Post deleted successfully" });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error deleting event post!",
            }));
        }
    };

    public likeEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, postId } = req.params;
            const { userId } = req.body;

            const event = await EventModel.findById(eventId);
            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            console.log(event, userId);

            const post = event.posts.id(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!",
                }));
            }

            const likeIndex = post.likes.indexOf(userId);
            if (likeIndex !== -1) {
                post.likes.splice(likeIndex, 1);
            } else {
                post.likes.push(userId);
            }

            await event.save();

            res.status(HttpCode.OK).json(post.likes);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error toggling post like!",
            }));
        }
    };

    public addCommentToEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, postId } = req.params;
            const { user_id, content } = req.body;

            if (!content) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Comment content is required!",
                }));
            }

            const event = await EventModel.findById(eventId);
            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const post = event.posts.id(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!",
                }));
            }

            post.comments.push({
                user_id,
                content
            });

            await event.save();

            const populatedEvent = await EventModel.populate(event, {
                path: 'posts.comments.user_id',
                select: 'username profile_picture'
            });

            const updatedPost = populatedEvent.posts.id(postId);
            res.status(HttpCode.CREATED).json(updatedPost?.comments[updatedPost.comments.length - 1]);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error adding comment to post!",
            }));
        }
    };

    public editCommentToEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, postId, commentId } = req.params;
            const { userId, content } = req.body;

            if (!content) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Comment content is required!",
                }));
            }

            const event = await EventModel.findById(eventId);
            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const post = event.posts.id(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!",
                }));
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Comment not found!",
                }));
            }

            if (comment.user_id.toString() !== userId) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "You can only edit your own comments!",
                }));
            }

            comment.content = content;
            comment.updatedAt = new Date();
            await event.save();

            const populatedEvent = await EventModel.populate(event, {
                path: 'posts.comments.user_id',
                select: 'username profile_picture'
            });

            const updatedPost = populatedEvent.posts.id(postId);
            const updatedComment = updatedPost?.comments.id(commentId);

            res.status(HttpCode.OK).json(updatedComment);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error editing comment!",
            }));
        }
    };

    public deleteCommentFromEventPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, postId, commentId } = req.params;
            const { userId } = req.body;

            const event = await EventModel.findById(eventId);
            if (!event) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Event not found!",
                }));
            }

            const post = event.posts.id(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!",
                }));
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Comment not found!",
                }));
            }

            if (comment.user_id.toString() !== userId && !event.creators.includes(userId)) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "You can only delete your own comments unless you're an event creator!",
                }));
            }

            post.comments.pull(commentId);
            await event.save();

            res.status(HttpCode.OK).json({ message: "Comment deleted successfully" });
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error deleting comment!",
            }));
        }
    };

}

export const eventController = new EventController();