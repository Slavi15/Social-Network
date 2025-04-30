import { Router } from "express";
import { eventController } from "@/controllers/eventsController.ts";

const eventsRouter = Router();

eventsRouter.get("/", eventController.getEvents);
eventsRouter.get("/:eventId", eventController.getEventById);
eventsRouter.get("/title/:title", eventController.getEventByTitle);

eventsRouter.post("/create", eventController.createEvent);
eventsRouter.put("/:eventId/update", eventController.updateEvent);
eventsRouter.delete("/:eventId/delete", eventController.deleteEvent);

eventsRouter.put("/:eventId/add", eventController.addCreator);
eventsRouter.put("/:eventId/remove", eventController.removeCreator);
eventsRouter.put("/:eventId/join", eventController.joinEvent);
eventsRouter.put("/:eventId/leave", eventController.leaveEvent);

eventsRouter.get('/:eventId/posts', eventController.getEventPosts);
eventsRouter.post('/:eventId/posts/create', eventController.createEventPost);
eventsRouter.put('/:eventId/posts/:postId/update', eventController.updateEventPost);
eventsRouter.delete('/:eventId/posts/:postId/delete', eventController.deleteEventPost);
eventsRouter.post('/:eventId/posts/:postId/like', eventController.likeEventPost);
eventsRouter.post('/:eventId/posts/:postId/comments', eventController.addCommentToEventPost);
eventsRouter.put('/:eventId/posts/:postId/comments/:commentId/edit', eventController.editCommentToEventPost);
eventsRouter.delete('/:eventId/posts/:postId/comments/:commentId/delete', eventController.deleteCommentFromEventPost);

export default eventsRouter;